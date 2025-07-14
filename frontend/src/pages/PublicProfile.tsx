import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import type { UserPublicProfile } from "../types/user";
import { getUserPublicProfile } from "../api/UserAPI";
import { useAuth } from "../context/AuthContext";

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token, logout } = useAuth();

  useEffect(() => {
    setLoading(true);
    if (!userId) return;
    getUserPublicProfile(Number(userId))
      .then(setProfile)
      .catch(() => setError("User not found."))
      .finally(() => setLoading(false));
  }, [userId]);

  // Patch type to allow bio for now
  const profileWithBio = profile as UserPublicProfile & { bio?: string };

  return (
    <div style={{ minHeight: "100vh", background: "#101014" }}>
      <Header user={user} token={token} logout={logout} />
      <div style={{ maxWidth: 500, margin: "48px auto 0 auto", background: "#18181c", borderRadius: 18, boxShadow: "0 2px 24px #0008", padding: "2.5rem 2rem 2rem 2rem", color: "#f5f6fa", position: "relative" }}>
        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : profile ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
              <img src={profile.profile_picture_url || "/default-avatar.png"} alt="Profile" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "4px solid #3b82f6", marginBottom: 16 }} />
              <h1 style={{ fontSize: 28, fontWeight: 900 }}>{profile.display_name || profile.username}</h1>
            </div>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Bio</div>
            <div style={{ fontSize: 16, marginBottom: 16 }}>
              {profileWithBio && typeof profileWithBio.bio === "string" && profileWithBio.bio.trim() !== ""
                ? profileWithBio.bio
                : <span style={{ color: "#888" }}>No bio yet.</span>}
            </div>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Username</div>
            <div style={{ fontSize: 16, marginBottom: 8 }}>{profile.username}</div>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Joined</div>
            <div style={{ fontSize: 16, marginBottom: 8 }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : ""}</div>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Status</div>
            <div style={{ fontSize: 16, marginBottom: 8 }}>{profile.is_active ? "Active" : "Inactive"}</div>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Verified</div>
            <div style={{ fontSize: 16, marginBottom: 8 }}>{profile.is_verified ? "Yes" : "No"}</div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PublicProfile;
