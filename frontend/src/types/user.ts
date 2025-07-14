// User types for public profile
export interface UserPublicProfile {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  profile_picture_url?: string; // For future use
  display_name?: string; // For display in UI
  is_active?: boolean;
  is_verified?: boolean;
  bio?: string; // User bio
}
