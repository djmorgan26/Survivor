// src/api/SurvivorAPI.ts
export interface SurvivorPlayer {
  castaway_id: string;
  season: number;
  castaway: string;
  age: number;
  occupation: string;
  result: string;
  day: number;
  original_tribe: string;
}

export interface SurvivorSeason {
  season: number;
  season_name: string;
  location: string;
  winner: string;
  n_cast: number;
  premiered: string;
  viewers_premiere: number;
}

class SurvivorAPI {
  private baseURL = 'https://github.com/doehm/survivoR/raw/master/dev/json/';

  async getAvailableSeasons(): Promise<SurvivorSeason[]> {
    const response = await fetch(`${this.baseURL}season_summary.json`);
    return response.json();
  }

  async getSeasonPlayers(season: number): Promise<SurvivorPlayer[]> {
    const response = await fetch(`${this.baseURL}castaways.json`);
    const allPlayers = await response.json();
    return allPlayers.filter((p: any) => p.season === season);
  }

  async getFeaturedPlayer(season: number): Promise<SurvivorPlayer | null> {
    const players = await this.getSeasonPlayers(season);
    if (players.length === 0) return null;
    // Pick a random player who is not the winner
    const nonWinners = players.filter(p => p.result !== 'Sole Survivor');
    const pick = nonWinners.length > 0 ? nonWinners : players;
    return pick[Math.floor(Math.random() * pick.length)];
  }
}

export default new SurvivorAPI();
