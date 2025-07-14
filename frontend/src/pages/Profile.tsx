import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import "../css/branding.css";
import { getUserPublicProfile } from "../api/UserAPI";
import type { UserPublicProfile } from "../types/user";
import { buildApiUrl } from "../config/api";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserPublicProfile(user.id)
      .then((data) => {
        console.log("Loaded profile data:", data);
        console.log("Setting profilePic to:", data.profile_picture_url);
        setProfile(data);
        setBio(data.bio || "");
        setProfilePic(data.profile_picture_url || null);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user || !token) return;
    
    const file = e.target.files[0];
    
    // Show preview first
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setUploading(true);
    setError("");
    setSuccess("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const url = buildApiUrl(`/api/users/${user.id}/profile_picture`);
      
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to upload profile picture");
      }
      
      const data = await res.json();
      
      console.log("Upload response data:", data);
      console.log("Setting profilePic to:", data.profile_picture_url);
      
      setProfilePic(data.profile_picture_url);
      setPreviewUrl(null); // Clear preview after successful upload
      // Update the profile state as well
      setProfile((p) => p ? { ...p, profile_picture_url: data.profile_picture_url } : p);
      setSuccess("Profile picture updated successfully!");
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
      
      // Force image refresh by incrementing the key
      setImageRefreshKey(prev => {
        console.log("Incrementing imageRefreshKey from", prev, "to", prev + 1);
        return prev + 1;
      });
      
      // Set a flag for the public profile to know about the update
      if (user) {
        localStorage.setItem(`profile_updated_${user.id}`, Date.now().toString());
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload profile picture");
      setPreviewUrl(null); // Clear preview on error
    } finally {
      setUploading(false);
    }
  };

  const handleBioSave = async () => {
    if (!user || !token) return;
    setUploading(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await fetch(buildApiUrl(`/api/users/${user.id}/bio`), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ bio }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to save bio");
      }
      
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setEditMode(false);
      setSuccess("Bio saved successfully!");
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
      
      // Set a flag for the public profile to know about the update
      if (user) {
        localStorage.setItem(`profile_updated_${user.id}`, Date.now().toString());
      }
    } catch (err: any) {
      setError(err.message || "Failed to save bio");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-lg">Sign in to view your profile.</div>
    );
  }

  if (loading) {
    return (
      <div style={{ background: "#101014", minHeight: "100vh", color: "#f5f6fa" }}>
        <Header user={user} token={token} logout={logout} />
        <div className="text-center mt-10 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#101014", minHeight: "100vh", color: "#f5f6fa" }}>
      <Header user={user} token={token} logout={logout} />
      
      {/* Banner */}
      <div style={{
        width: "100%",
        height: 240,
        background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1e40af 100%)",
        position: "relative",
        marginBottom: 0,
        overflow: "visible",
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />
        
        {/* Profile Picture */}
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: -100,
          transform: "translateX(-50%)",
          zIndex: 2,
        }}>
          <div style={{ position: "relative" }}>
            {/* Profile picture container with better styling */}
            <div style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #1e40af)",
              padding: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
              // Show overlay
              const overlay = e.currentTarget.querySelector('.profile-overlay') as HTMLElement;
              if (overlay) overlay.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
              // Hide overlay
              const overlay = e.currentTarget.querySelector('.profile-overlay') as HTMLElement;
              if (overlay) overlay.style.opacity = '0';
            }}
            onClick={() => {
              fileInputRef.current?.click();
            }}
            title="Click to change profile picture"
            >
              <img
                src={previewUrl || (profilePic ? `${buildApiUrl(profilePic)}?v=${imageRefreshKey}` : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E")}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  background: "#23232b",
                }}
                onLoad={() => {
                  console.log("Image loaded successfully");
                  console.log("Current profilePic:", profilePic);
                  console.log("Current imageRefreshKey:", imageRefreshKey);
                  console.log("Current full src:", previewUrl || (profilePic ? `${buildApiUrl(profilePic)}?v=${imageRefreshKey}` : "default"));
                }}
                onError={(e) => {
                  console.log("Image failed to load");
                  console.log("Current profilePic:", profilePic);
                  console.log("Current imageRefreshKey:", imageRefreshKey);
                  console.log("Current full src:", previewUrl || (profilePic ? `${buildApiUrl(profilePic)}?v=${imageRefreshKey}` : "default"));
                  
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div style="
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #3b82f6, #1e40af);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 48px;
                        font-weight: bold;
                        text-transform: uppercase;
                      ">
                        ${user.username.charAt(0)}
                      </div>
                    `;
                  }
                }}
              />
              {/* Hover overlay */}
              <div 
                className="profile-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  pointerEvents: "none",
                }}
              >
                <div style={{ 
                  color: "#fff", 
                  fontSize: 16, 
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: 1.2
                }}>
                  <div>📷</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Change</div>
                </div>
              </div>
            </div>
            
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => {
                handleProfilePicChange(e);
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div style={{
        maxWidth: 700,
        margin: "120px auto 0 auto",
        background: "#18181c",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        padding: "3rem 2.5rem 2.5rem 2.5rem",
        color: "#f5f6fa",
        position: "relative",
        border: "1px solid #23232b",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ 
            fontSize: 36, 
            fontWeight: 900, 
            marginBottom: 8,
            background: "linear-gradient(135deg, #3b82f6, #1e40af)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {user.username}
          </h1>
          <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 16, marginBottom: 12 }}>
            {user.email}
          </div>
          <div style={{ color: "#8b9bb4", fontWeight: 400, fontSize: 14 }}>
            Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : ""}
          </div>
        </div>

        {/* Bio Section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ 
            color: "#bfc4d1", 
            fontWeight: 600, 
            fontSize: 18, 
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            📝 Bio
          </div>
          <div style={{ 
            fontSize: 12, 
            color: "#8b9bb4", 
            marginBottom: 12,
            fontStyle: "italic"
          }}>
            Share a bit about yourself with other players (max 300 characters)
          </div>
          {editMode ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "2px solid #3b82f6",
                  padding: 16,
                  fontSize: 16,
                  background: "#23232b",
                  color: "#fff",
                  marginBottom: 8,
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                maxLength={300}
                placeholder="Tell us about yourself..."
              />
              <div style={{ 
                fontSize: 12, 
                color: bio.length > 280 ? "#ef4444" : "#8b9bb4", 
                textAlign: "right", 
                marginBottom: 16 
              }}>
                {bio.length}/300 characters
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handleBioSave}
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                  }}
                  disabled={uploading}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {uploading ? "Saving..." : "Save Bio"}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setBio(profile?.bio || ""); // Reset to original value
                    setError("");
                    setSuccess("");
                  }}
                  style={{
                    background: "transparent",
                    color: "#bfc4d1",
                    border: "2px solid #3b82f6",
                    borderRadius: 10,
                    padding: "12px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                  }}
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div style={{ 
              fontSize: 16, 
              marginBottom: 16, 
              minHeight: 48,
              padding: 16,
              background: "#23232b",
              borderRadius: 12,
              border: "1px solid #2d3748",
            }}>
              {profile?.bio && profile.bio.trim() !== "" ? (
                profile.bio
              ) : (
                <span style={{ color: "#8b9bb4", fontStyle: "italic" }}>
                  No bio yet. Click "Edit Profile" to add one!
                </span>
              )}
            </div>
          )}
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              style={{
                background: "transparent",
                color: "#3b82f6",
                border: "2px solid #3b82f6",
                borderRadius: 10,
                padding: "10px 20px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#3b82f6";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#3b82f6";
              }}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Stats Section */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 24, 
          marginTop: 32,
          padding: 24,
          background: "#23232b",
          borderRadius: 16,
          border: "1px solid #2d3748",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#8b9bb4", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Status</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: profile?.is_active ? "#10b981" : "#ef4444" }}>
              {profile?.is_active ? "🟢 Active" : "🔴 Inactive"}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#8b9bb4", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Verified</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: profile?.is_verified ? "#10b981" : "#f59e0b" }}>
              {profile?.is_verified ? "✅ Yes" : "⏳ Pending"}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#8b9bb4", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Role</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: profile?.is_admin ? "#8b5cf6" : "#3b82f6" }}>
              {profile?.is_admin ? "👑 Admin" : "👤 User"}
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: "#dc2626",
            color: "#fff",
            borderRadius: 8,
            textAlign: "center",
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: "#10b981",
            color: "#fff",
            borderRadius: 8,
            textAlign: "center",
          }}>
            {success}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#18181c",
          color: "#8b9bb4",
          textAlign: "center",
          padding: "2rem 0",
          marginTop: 60,
          borderTop: "1px solid #23232b",
        }}
      >
        <p style={{ margin: 0, fontSize: 14 }}>© 2025 Reality Fantasy League. All rights reserved.</p>
      </footer>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
