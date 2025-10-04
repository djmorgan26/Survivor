"""
Survivor Fandom Wiki Scraper - Proof of Concept

⚠️ LEGAL NOTICE:
Fandom's Terms of Service prohibit automated scraping without express written permission.
This script is for EDUCATIONAL and PROOF-OF-CONCEPT purposes only.

For production use, you MUST:
1. Contact Fandom to request written permission for automated access
2. Use their official API endpoints where possible
3. Respect rate limits and robots.txt guidelines
4. Consider alternative data sources

Recommended Alternative: Use MediaWiki API endpoints which are explicitly allowed in robots.txt
"""

import aiohttp
import asyncio
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
import json


class SurvivorScraper:
    """Scraper for Survivor Fandom Wiki using MediaWiki API"""

    BASE_URL = "https://survivor.fandom.com"
    API_URL = f"{BASE_URL}/api.php"

    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={
                'User-Agent': 'SurvivorFantasyApp/1.0 (Educational/Research)'
            }
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def get_season_html(self, season: int) -> str:
        """
        Fetch parsed HTML for a season using MediaWiki Parse API

        This endpoint is allowed in robots.txt: /api.php?action=parse
        """
        params = {
            'action': 'parse',
            'page': f'Survivor_{season}',
            'format': 'json',
            'prop': 'text'
        }

        async with self.session.get(self.API_URL, params=params) as resp:
            data = await resp.json()

            if 'error' in data:
                raise ValueError(f"API Error: {data['error']['info']}")

            # Extract HTML content from JSON response
            html_content = data['parse']['text']['*']
            return html_content

    async def get_season_metadata(self, season: int) -> Dict:
        """
        Fetch season metadata using Fandom's v1 API
        """
        url = f"{self.BASE_URL}/api/v1/Articles/Details"
        params = {'titles': f'Survivor_{season}'}

        async with self.session.get(url, params=params) as resp:
            data = await resp.json()
            return data['items'][str(list(data['items'].keys())[0])]

    def parse_contestants(self, html: str) -> List[Dict]:
        """
        Parse contestant data from HTML table

        The contestant table has class 'wikitable sortable' and contains:
        - Name, Age, Occupation
        - Original Tribe
        - Finish/Status
        - Votes Against
        - Advantages
        """
        soup = BeautifulSoup(html, 'html.parser')
        contestants = []

        # Find the main contestant table - look for table with contestant data
        # It typically has headers like "Contestant", "Age", "Tribe", etc.
        tables = soup.find_all('table', {'class': 'wikitable'})

        for table in tables:
            # Check if this is the contestants table by looking at headers
            headers = table.find('tr')
            if not headers:
                continue

            header_text = headers.get_text().lower()
            if 'contestant' not in header_text and 'castaway' not in header_text:
                continue

            rows = table.find_all('tr')[1:]  # Skip header row

            for row in rows:
                cells = row.find_all(['td', 'th'])

                if len(cells) < 3:
                    continue

                contestant = {}

                # First cell usually has image, second has name/info
                # Look for the cell with contestant name (has a link to their page)
                name_cell = None
                for i, cell in enumerate(cells[:4]):
                    links = cell.find_all('a')
                    for link in links:
                        href = link.get('href', '')
                        text = link.get_text(strip=True)
                        # Skip file links, tribe links, and short text
                        if (text and len(text) > 3 and
                            not text.startswith('File:') and
                            '/wiki/' in href and
                            not any(word in href.lower() for word in ['/tribe', '/episode', '/season'])):
                            contestant['name'] = text
                            name_cell = i
                            break
                    if 'name' in contestant:
                        break

                if 'name' not in contestant:
                    continue

                # Extract age/occupation from the same cell or next cell
                if name_cell is not None and name_cell < len(cells):
                    info_text = cells[name_cell].get_text(strip=True)
                    # Age is usually a number after the name
                    lines = info_text.split('\n')
                    if len(lines) > 1:
                        for line in lines[1:]:
                            line = line.strip()
                            if line.isdigit():
                                contestant['age'] = int(line)
                            elif line and not line.isdigit():
                                contestant['occupation'] = line
                                break

                # Extract tribe (usually a colored cell with tribe name)
                for cell in cells:
                    style = cell.get('style', '')
                    bgcolor = cell.get('bgcolor', '')
                    if 'background' in style or bgcolor:
                        tribe_link = cell.find('a')
                        if tribe_link:
                            tribe_name = tribe_link.get_text(strip=True)
                            # Verify it's a tribe name (short text, capitalized)
                            if tribe_name and len(tribe_name) < 20:
                                contestant['tribe'] = tribe_name

                # Extract status (look for "Voted Out" or placement info)
                for cell in cells:
                    text = cell.get_text(strip=True)
                    if 'Voted Out' in text or 'voted out' in text.lower():
                        contestant['status'] = 'voted_out'
                        # Extract day info
                        if 'Day' in text:
                            contestant['elimination_day'] = text
                    elif 'Still in game' in text:
                        contestant['status'] = 'active'

                # If no status found, assume active
                if 'status' not in contestant:
                    contestant['status'] = 'active'

                contestants.append(contestant)

        return contestants

    async def get_season_data(self, season: int) -> Dict:
        """
        Get complete season data including metadata and contestants
        """
        # Fetch HTML and metadata in parallel
        html_task = self.get_season_html(season)
        metadata_task = self.get_season_metadata(season)

        html, metadata = await asyncio.gather(html_task, metadata_task)

        # Parse contestants from HTML
        contestants = self.parse_contestants(html)

        return {
            'season': season,
            'title': metadata.get('title'),
            'abstract': metadata.get('abstract'),
            'thumbnail': metadata.get('thumbnail'),
            'contestants': contestants,
            'last_updated': metadata.get('revision', {}).get('timestamp')
        }


async def main():
    """Example usage"""
    async with SurvivorScraper() as scraper:
        # Get Season 49 data
        season_data = await scraper.get_season_data(49)

        print(f"\n{'='*60}")
        print(f"Season: {season_data['title']}")
        print(f"{'='*60}")
        print(f"\nAbstract: {season_data['abstract']}")
        print(f"\nContestants found: {len(season_data['contestants'])}")
        print(f"\n{'='*60}")
        print("Contestant Details:")
        print(f"{'='*60}\n")

        for contestant in season_data['contestants']:
            status = "❌ Voted Out" if contestant.get('status') == 'voted_out' else "✅ Active"
            tribe = contestant.get('tribe', 'Unknown')
            placement = contestant.get('placement', '')

            print(f"• {contestant['name']:25} | Tribe: {tribe:10} | {status:15} {placement}")

        # Save to JSON
        with open('season_49_data.json', 'w') as f:
            json.dump(season_data, f, indent=2)

        print(f"\n{'='*60}")
        print("Data saved to season_49_data.json")
        print(f"{'='*60}\n")


if __name__ == "__main__":
    asyncio.run(main())
