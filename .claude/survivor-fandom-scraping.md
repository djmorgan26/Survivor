# Survivor Fandom Wiki - Web Scraping Documentation

## ⚠️ Legal and Ethical Considerations

### Terms of Service
**Fandom's Terms of Use explicitly prohibit automated scraping without express written permission.**

From Fandom's TOS:
> Users may not "use any robot, spider, scraper or other automated means to access the Services for any purpose without our express written permission."

### Recommendations for Production Use

1. **Contact Fandom for Permission**: Before deploying any automated scraping in production, you MUST contact Fandom to request written permission.

2. **Use Official APIs First**: Always prefer using official MediaWiki APIs over HTML scraping.

3. **Respect robots.txt**: Check and comply with `https://survivor.fandom.com/robots.txt`

4. **Rate Limiting**: Implement delays between requests (minimum 1-2 seconds)

5. **Alternative Data Sources**: Consider using:
   - The `doehm/survivoR` GitHub repository (limited to older seasons)
   - Manual data entry for current seasons
   - Official CBS data sources if available

---

## Available Data Sources

### 1. MediaWiki Parse API (Allowed in robots.txt)

**Endpoint:**
```
https://survivor.fandom.com/api.php?action=parse&page=PAGENAME&format=json&prop=text
```

**Example:**
```bash
curl "https://survivor.fandom.com/api.php?action=parse&page=Survivor_49&format=json&prop=text"
```

**Response Structure:**
```json
{
  "parse": {
    "title": "Survivor 49",
    "pageid": 211594,
    "text": {
      "*": "<div class=\"mw-parser-output\">...HTML content...</div>"
    }
  }
}
```

**Pros:**
- Explicitly allowed in robots.txt: `/api.php?action=parse`
- Returns parsed HTML (easier to scrape than wikitext)
- Stable endpoint
- JSON response format

**Cons:**
- HTML structure can change
- Requires HTML parsing

---

### 2. Fandom v1 Articles API

**Endpoint:**
```
https://survivor.fandom.com/api/v1/Articles/Details?titles=PAGENAME
```

**Example:**
```bash
curl "https://survivor.fandom.com/api/v1/Articles/Details?titles=Survivor_49"
```

**Response Structure:**
```json
{
  "items": {
    "211594": {
      "id": 211594,
      "title": "Survivor 49",
      "url": "/wiki/Survivor_49",
      "abstract": "Survivor 49 is the forty-ninth season...",
      "thumbnail": "https://static.wikia.nocookie.net/.../Survivor_49_Logo.png",
      "revision": {
        "id": 1234567,
        "user": "Username",
        "user_id": 12345,
        "timestamp": "1759418306"
      }
    }
  }
}
```

**Pros:**
- Clean JSON response
- Metadata about articles
- Revision tracking
- Thumbnail URLs

**Cons:**
- Only provides metadata, not full content
- May change without notice (v1 API)

---

### 3. MediaWiki Query API

**Endpoint:**
```
https://survivor.fandom.com/api.php?action=query&titles=PAGENAME&prop=revisions&rvprop=content&format=json
```

**Response Format:** Returns wikitext (requires parsing)

**Pros:**
- Official MediaWiki API
- Comprehensive data

**Cons:**
- Returns wikitext format (harder to parse than HTML)
- Requires wikitext parser library

---

## Data Structures on Survivor Wiki Pages

### Contestant Table Structure

Located on season pages (e.g., `Survivor_49`), the contestant table typically has:

**Table Characteristics:**
- CSS Class: `wikitable sortable`
- Headers: "Contestant", "Age", "From", "Tribe", "Finish", etc.
- Color-coded by tribe (background colors on tribe cells)

**Columns (typical structure):**
1. **Image**: Thumbnail of contestant
2. **Contestant**: Name, Age, Occupation
3. **Tribe**: Original tribe assignment (color-coded)
4. **Finish/Status**: Placement or "Still in game"
5. **Votes Against**: Number of votes received
6. **Advantages**: Any advantages/idols held

**HTML Example:**
```html
<table class="wikitable sortable">
  <tr>
    <th>Contestant</th>
    <th>Age</th>
    <th>Tribe</th>
    <th>Finish</th>
  </tr>
  <tr>
    <td><a href="/wiki/Nicole_Mazullo">Nicole Mazullo</a><br>30<br>Teacher</td>
    <td style="background:#FF6666"><a href="/wiki/Hina">Hina</a></td>
    <td>1st Voted Out<br>Day 3</td>
  </tr>
</table>
```

---

## Parsing Strategy

### Recommended Approach

1. **Fetch via MediaWiki Parse API** to get HTML
2. **Parse HTML with BeautifulSoup** (Python) or Cheerio (JavaScript)
3. **Filter tables** by looking for headers containing "Contestant" or "Castaway"
4. **Extract data** from table rows

### Key Identifiers

**To identify contestant names:**
- Look for links with `/wiki/` in href
- Exclude links containing: `/Tribe`, `/Episode`, `/Season`, `File:`
- Name should be 4+ characters

**To identify elimination status:**
- Text containing "Voted Out" → status: `voted_out`
- Text containing "Still in game" → status: `active`
- Extract day number from text like "Day 3"

**To identify tribes:**
- Look for cells with background colors
- Short text (< 20 characters)
- Usually has a link to tribe page

---

## Python Implementation

See `backend/survivor_scraper.py` for a complete proof-of-concept implementation.

### Key Features:
- Uses async/await with aiohttp for efficient requests
- Parses contestant table with BeautifulSoup
- Extracts: name, age, occupation, tribe, status, elimination day
- Outputs JSON format
- Context manager pattern for session management

### Usage:
```python
async with SurvivorScraper() as scraper:
    season_data = await scraper.get_season_data(49)
    print(season_data['contestants'])
```

---

## Weekly Update Strategy

### Automated Approach (Requires Permission)

1. **Schedule**: Run scraper weekly after episode air date (typically Thursday nights)
2. **Rate Limit**: 1-2 seconds between requests
3. **Caching**: Store timestamp of last fetch to avoid unnecessary requests
4. **Error Handling**: Gracefully handle API changes or network errors
5. **Diff Detection**: Compare new data with database to identify changes

### Cron Job Example:
```bash
# Run every Thursday at 11 PM (after episode airs at 8 PM ET)
0 23 * * 4 cd /path/to/backend && python survivor_scraper.py
```

### Manual Approach (Safer for Now)

1. Run scraper manually after watching episode
2. Review data before updating database
3. No risk of Terms of Service violation
4. More reliable for catching data errors

---

## Integration with FastAPI Backend

### Recommended Flow:

1. **Scraper runs** (manually or scheduled)
2. **Saves JSON** to temporary file
3. **Admin reviews** data via admin panel
4. **Admin approves** → Data inserted into PostgreSQL database
5. **API serves** data from database (not live scraping)

### Database Schema Considerations:

```sql
-- Contestants table
CREATE TABLE contestants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    season INTEGER NOT NULL,
    age INTEGER,
    occupation VARCHAR(255),
    tribe VARCHAR(100),
    status VARCHAR(50), -- 'active' or 'voted_out'
    elimination_day INTEGER,
    placement VARCHAR(100),
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Scrape log table (track updates)
CREATE TABLE scrape_log (
    id SERIAL PRIMARY KEY,
    season INTEGER,
    scraped_at TIMESTAMP DEFAULT NOW(),
    contestants_found INTEGER,
    status VARCHAR(50), -- 'pending', 'approved', 'rejected'
    data JSONB
);
```

---

## robots.txt Analysis

### Allowed Paths:
- `/api.php?action=parse` ✅
- `/api.php?action=query` ✅
- `/wiki/` pages (with User-Agent compliance) ✅

### Disallowed Bots:
- SemrushBot
- serpstatbot
- GPTBot
- Google-Extended
- ImagesiftBot

### Rate Limiting:
- `ias_crawler` has 1 second crawl delay
- Recommended: Implement 1-2 second delays minimum

---

## Best Practices

### 1. User-Agent Header
Always identify your bot:
```python
headers = {
    'User-Agent': 'SurvivorFantasyApp/1.0 (Educational/Research; contact@example.com)'
}
```

### 2. Error Handling
```python
try:
    data = await scraper.get_season_data(49)
except ValueError as e:
    # API returned error (e.g., page not found)
    logger.error(f"API Error: {e}")
except aiohttp.ClientError as e:
    # Network error
    logger.error(f"Network Error: {e}")
```

### 3. Caching
- Cache API responses for 24 hours
- Store `last_updated` timestamp
- Only re-fetch if data is stale

### 4. Validation
- Verify contestant count matches expected
- Check for duplicate names
- Validate status values
- Ensure elimination order is sequential

---

## Testing Checklist

Before deploying scraper:

- [ ] Test with multiple seasons (e.g., 48, 49)
- [ ] Verify contestant count accuracy
- [ ] Check voted out status is correct
- [ ] Validate elimination day extraction
- [ ] Test error handling (invalid season number)
- [ ] Verify rate limiting works
- [ ] Test caching mechanism
- [ ] Review logs for any warnings

---

## Alternative: Manual Data Entry

If scraping is not viable, consider:

1. **Admin panel** for manual contestant entry
2. **CSV import** feature
3. **Weekly update reminder** emails to admin
4. **Volunteer contributors** who update after each episode

---

## Future Enhancements

1. **Episode data**: Scrape episode summaries, challenges, votes
2. **Historical seasons**: Bulk import past seasons
3. **Player stats**: Track confessionals, challenge wins, idols
4. **Tribal council**: Parse voting data
5. **Alliances**: Extract alliance information from wiki
6. **Photos**: Download contestant photos for offline use

---

## Contact Information for Permission

To request scraping permission from Fandom:
- **Website**: https://www.fandom.com/contact
- **Business Inquiries**: Look for partnership/API access options
- **Alternative**: Reach out to Survivor Wiki admins via the wiki

---

## Summary

| Method | Legal Status | Difficulty | Data Quality | Recommended |
|--------|-------------|------------|--------------|-------------|
| MediaWiki Parse API | ⚠️ Requires permission | Medium | High | Yes |
| Fandom v1 API | ⚠️ Requires permission | Easy | Medium | For metadata only |
| HTML Scraping | ❌ Against TOS | Medium | High | No |
| Manual Entry | ✅ Allowed | Low | Very High | Yes (for now) |
| doehm/survivoR Repo | ✅ Open source | Easy | High | Yes (historical only) |

**Current Recommendation**: Use manual data entry until Fandom permission is obtained, then implement automated scraping with the MediaWiki Parse API.
