import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import "../css/branding.css";
import { getUserPublicProfile } from "../api/UserAPI";
import type { UserPublicProfile } from "../types/user";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState<UserPublicProfile & { bio?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserPublicProfile(user.id)
      .then((data) => {
        setProfile(data);
        setBio(data.bio || "");
        setProfilePic(data.profile_picture_url || null);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    const file = e.target.files[0];
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/users/${user.id}/profile_picture`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setProfilePic(data.profile_picture_url);
    }
    setUploading(false);
  };

  const handleBioSave = async () => {
    if (!user) return;
    setUploading(true);
    await fetch(`/api/users/${user.id}/bio`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ bio }),
    });
    setEditMode(false);
    setUploading(false);
    setProfile((p) => (p ? { ...p, bio } : p));
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-lg">Sign in to view your profile.</div>
    );
  }

  return (
    <div style={{ background: "#101014", minHeight: "100vh", color: "#f5f6fa" }}>
      <Header user={user} token={token} logout={logout} />
      {/* Banner */}
      <div style={{
        width: "100%",
        height: 180,
        background: "linear-gradient(135deg, #23232b 60%, #3b82f6 120%)",
        position: "relative",
        marginBottom: 0,
      }}>
        {/* Profile Picture */}
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: -64,
          transform: "translateX(-50%)",
          zIndex: 2,
        }}>
          <div style={{ position: "relative" }}>
            <img
              src={profilePic || "/default-avatar.png"}
              alt="Profile"
              style={{
                width: 128,
                height: 128,
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #18181c",
                background: "#23232b",
                boxShadow: "0 2px 16px #0008",
              }}
            />
            {/* Upload button */}
            <button
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                cursor: "pointer",
                boxShadow: "0 2px 8px #0006",
              }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Change profile picture"
            >
              {uploading ? "..." : "✎"}
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleProfilePicChange}
            />
          </div>
        </div>
      </div>
      {/* Main Card */}
      <div style={{
        maxWidth: 600,
        margin: "96px auto 0 auto",
        background: "#18181c",
        borderRadius: 18,
        boxShadow: "0 2px 24px #0008",
        padding: "2.5rem 2rem 2rem 2rem",
        color: "#f5f6fa",
        position: "relative",
      }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>{user.username}</h1>
          <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
            Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ""}
          </div>
        </div>
        {/* Bio */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Bio</div>
          {editMode ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  borderRadius: 8,
                  border: "1.5px solid #3b82f6",
                  padding: 10,
                  fontSize: 16,
                  background: "#23232b",
                  color: "#fff",
                  marginBottom: 8,
                  resize: "vertical",
                }}
                maxLength={300}
              />
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handleBioSave}
                  style={{
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "0.5rem 1.2rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                  disabled={uploading}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  style={{
                    background: "#23232b",
                    color: "#bfc4d1",
                    border: "1.5px solid #3b82f6",
                    borderRadius: 8,
                    padding: "0.5rem 1.2rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 16, marginBottom: 8, minHeight: 32 }}>
              {profile?.bio && profile.bio.trim() !== "" ? profile.bio : <span style={{ color: "#888" }}>No bio yet.</span>}
            </div>
          )}
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              style={{
                background: "#23232b",
                color: "#3b82f6",
                border: "1.5px solid #3b82f6",
                borderRadius: 8,
                padding: "0.4rem 1.1rem",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "1rem",
                marginTop: 4,
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
        {/* Metadata */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 24 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 15 }}>Status</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{profile?.is_active ? "Active" : "Inactive"}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 15 }}>Verified</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{profile?.is_verified ? "Yes" : "No"}</div>
          </div>
        </div>
      </div>
      <footer
        className="profile-footer"
        style={{
          background: "#18181c",
          color: "#bfc4d1",
          textAlign: "center",
          padding: "1.2rem 0",
          marginTop: 40,
          borderTop: "1px solid #23232b",
        }}
      >
        <p>© 2025 Reality Fantasy League. All rights reserved.</p>
      </footer>
    </div>
  );
}
