// src/api/LeagueAPI.ts
import type { LeagueOut, LeagueMembershipOut } from "../types/league";

const BASE_URL = "/api/leagues";

export async function getLeagues(token: string): Promise<LeagueOut[]> {
  const res = await fetch(BASE_URL + "/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return []; // No leagues yet
  if (!res.ok) throw new Error("Failed to fetch leagues");
  return res.json();
}

export async function createLeague(
  league: Partial<LeagueOut>,
  token: string
): Promise<LeagueOut> {
  const res = await fetch(BASE_URL + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(league),
  });
  if (!res.ok) throw new Error("Failed to create league");
  return res.json();
}

export async function joinLeague(
  leagueId: number,
  token: string
): Promise<LeagueMembershipOut> {
  const res = await fetch(`${BASE_URL}/${leagueId}/join`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to join league");
  return res.json();
}

export async function getLeagueMembers(
  leagueId: number,
  token: string
): Promise<LeagueMembershipOut[]> {
  const res = await fetch(`${BASE_URL}/${leagueId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

export async function deleteLeague(
  leagueId: number,
  token: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${leagueId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete league");
}
