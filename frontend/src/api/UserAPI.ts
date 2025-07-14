// UserAPI.ts - API calls for user-related endpoints
import type { UserPublicProfile } from "../types/user";
import type { LeagueOut } from "../types/league";
import { buildApiUrl } from "../config/api";

export async function getUserPublicProfile(userId: number, cacheBust?: boolean): Promise<UserPublicProfile> {
  const url = buildApiUrl(`/api/users/${userId}/public`);
  const finalUrl = cacheBust ? `${url}?t=${Date.now()}` : url;
  
  const res = await fetch(finalUrl);
  if (!res.ok) throw new Error("Failed to fetch user profile");
  const data = await res.json();
  // Add display_name for UI convenience
  return {
    ...data,
    display_name: data.first_name || data.last_name
      ? `${data.first_name || ""} ${data.last_name || ""}`.trim()
      : data.username,
  };
}

export async function getUserLeagues(userId: number): Promise<LeagueOut[]> {
  const res = await fetch(buildApiUrl(`/api/users/${userId}/leagues`));
  if (!res.ok) throw new Error("Failed to fetch user leagues");
  return res.json();
}

// Add more user-related API calls as needed
