// src/types/league.ts
export type GameType = "survivor" | "love_island" | "big_brother" | "traitors";
export type MemberRole = "owner" | "admin" | "member";

export interface LeagueSettingsOut {
  id: number;
  max_members: number;
  is_private: boolean;
}

export interface LeagueOut {
  id: number;
  name: string;
  game_type: GameType;
  created_at: string;
  owner_id: number;
  join_code: string; // Added join_code for LeagueDetails
  settings?: LeagueSettingsOut;
}

export interface LeagueMembershipOut {
  id: number;
  league_id: number;
  user_id: number;
  role: MemberRole;
  joined_at: string;
}
