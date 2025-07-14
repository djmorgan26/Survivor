// UserAPI.ts - API calls for user-related endpoints
import type { UserPublicProfile } from "../types/user";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function getUserPublicProfile(userId: number): Promise<UserPublicProfile> {
  const res = await fetch(`${API_BASE}/users/${userId}/public`);
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

// Add more user-related API calls as needed
