from fastapi import APIRouter, Query
import aiohttp
import json

router = APIRouter()

BASE_URL = "https://github.com/doehm/survivoR/raw/master/dev/json/"

@router.get("/survivor/seasons")
async def get_survivor_seasons():
    """Get all Survivor seasons (summary info)"""
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE_URL}season_summary.json") as resp:
            text = await resp.text()
            return json.loads(text)

@router.get("/survivor/players")
async def get_survivor_players(
    season: int = Query(..., description="Season number"),
    version: str = Query("US", description="Survivor version, e.g. 'US', 'AU'")
):
    """Get all players for a given season and version (e.g., US, AU)"""
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE_URL}castaways.json") as resp:
            text = await resp.text()
            data = json.loads(text)
            # Filter by both season and version
            return [c for c in data if c.get("season") == season and c.get("version", "US") == version]

@router.get("/survivor/player-stats")
async def get_survivor_player_stats(player_id: str = Query(..., description="Castaway ID")):
    """Get stats for a specific player (votes, challenges, confessionals)"""
    async with aiohttp.ClientSession() as session:
        votes_task = session.get(f"{BASE_URL}vote_history.json")
        challenges_task = session.get(f"{BASE_URL}challenge_results.json")
        confessionals_task = session.get(f"{BASE_URL}confessionals.json")
        votes_resp, challenges_resp, confessionals_resp = await aiohttp.gather(votes_task, challenges_task, confessionals_task)
        votes = json.loads(await votes_resp.text())
        challenges = json.loads(await challenges_resp.text())
        confessionals = json.loads(await confessionals_resp.text())
        return {
            "votes": [v for v in votes if v.get("castaway_id") == player_id],
            "challenges": [c for c in challenges if c.get("castaway_id") == player_id],
            "confessionals": [c for c in confessionals if c.get("castaway_id") == player_id]
        }
