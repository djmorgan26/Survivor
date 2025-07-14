import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import type { UserPublicProfile } from "../types/user";
import type { LeagueOut } from "../types/league";
import { getUserPublicProfile, getUserLeagues } from "../api/UserAPI";
import { useAuth } from "../context/AuthContext";
import { buildApiUrl } from "../config/api";

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [leagues, setLeagues] = useState<LeagueOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const loadProfileData = async (useCacheBust = false) => {
    if (!userId) return;
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Fetch both profile and leagues
      const [profileData, leaguesData] = await Promise.all([
        getUserPublicProfile(Number(userId), useCacheBust),
        getUserLeagues(Number(userId)).catch(() => []) // Don't fail if leagues can't be loaded
      ]);
      
      setProfile(profileData);
      setLeagues(leaguesData);
      
      // Show success message if this was a manual refresh
      if (user && user.id === Number(userId) && useCacheBust) {
        setSuccess("Profile refreshed successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError("User not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  // Auto-refresh profile data every 30 seconds if viewing own profile
  useEffect(() => {
    if (user && userId && user.id === Number(userId)) {
      const interval = setInterval(() => {
        loadProfileData();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [user, userId]);

  // Check if user just updated their profile (by checking localStorage)
  useEffect(() => {
    if (user && userId && user.id === Number(userId)) {
      const lastUpdate = localStorage.getItem(`profile_updated_${user.id}`);
      if (lastUpdate) {
        const updateTime = parseInt(lastUpdate);
        const now = Date.now();
        // If profile was updated in the last 5 minutes, show a notification
        if (now - updateTime < 5 * 60 * 1000) {
          setSuccess("Your profile was recently updated! Click 'Refresh' to see the latest changes.");
          setTimeout(() => setSuccess(""), 5000);
          // Clear the flag
          localStorage.removeItem(`profile_updated_${user.id}`);
        }
      }
    }
  }, [user, userId]);

  // Patch type to allow bio for now
  const profileWithBio = profile as UserPublicProfile & { bio?: string };

  // Generate initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = profile?.display_name || profile?.username || 'Unknown User';
  const initials = getInitials(displayName);

  // Get game type display name
  const getGameTypeDisplay = (gameType: string) => {
    return gameType
      .replace('_', ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get game type color
  const getGameTypeColor = (gameType: string) => {
    switch (gameType) {
      case 'survivor': return '#3b82f6';
      case 'love_island': return '#06b6d4';
      case 'big_brother': return '#f59e42';
      case 'traitors': return '#a855f7';
      default: return '#3b82f6';
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#101014" }}>
      <Header user={user} token={token} logout={logout} />
      
      <div style={{
        maxWidth: 700,
        margin: "100px auto 0 auto",
        background: "#18181c",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        padding: "3rem 2.5rem 2.5rem 2.5rem",
        color: "#f5f6fa",
        position: "relative",
        border: "1px solid #23232b",
      }}>
        {loading ? (
          <div style={{ 
            textAlign: "center", 
            fontSize: "1.2rem", 
            color: "#3b82f6",
            fontWeight: 600,
            padding: "2rem"
          }}>
            Loading profile...
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: "center", 
            color: "#ef4444",
            fontSize: "1.1rem",
            fontWeight: 600,
            padding: "2rem"
          }}>
            {error}
          </div>
        ) : profile ? (
          <>
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

            {/* Header Section */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 style={{ 
                fontSize: 36, 
                fontWeight: 900, 
                marginBottom: 8,
                background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {displayName}
              </h1>
              
              {/* Profile Picture */}
              <div style={{ 
                position: "relative", 
                display: "inline-block", 
                marginBottom: 16 
              }}>
                {profile.profile_picture_url ? (
                  <img 
                    src={buildApiUrl(profile.profile_picture_url)} 
                    alt="Profile" 
                    style={{ 
                      width: 140, 
                      height: 140, 
                      borderRadius: "50%", 
                      objectFit: "cover",
                      border: "4px solid transparent",
                      background: "linear-gradient(45deg, #3b82f6, #1e40af, #06b6d4, #0891b2) border-box",
                      backgroundClip: "border-box",
                      boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
                    }}
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div style="
                            width: 140px;
                            height: 140px;
                            border-radius: 50%;
                            background: linear-gradient(135deg, #3b82f6, #1e40af);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 3rem;
                            font-weight: 900;
                            color: white;
                            border: 4px solid transparent;
                            background-clip: border-box;
                            box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
                          ">
                            ${initials}
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "#fff",
                    border: "4px solid transparent",
                    backgroundClip: "border-box",
                    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
                  }}>
                    {initials}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
                @{profile.username}
              </div>
              <div style={{ color: "#8b9bb4", fontWeight: 400, fontSize: 14 }}>
                Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
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
                gap: 8
              }}>
                📝 Bio
              </div>
              <div style={{ 
                fontSize: 16, 
                marginBottom: 16,
                minHeight: 48,
                padding: 16,
                background: "#23232b",
                borderRadius: 12,
                border: "1px solid #2d3748",
                lineHeight: 1.6,
              }}>
                {profileWithBio && typeof profileWithBio.bio === "string" && profileWithBio.bio.trim() !== ""
                  ? profileWithBio.bio
                  : <span style={{ color: "#8b9bb4", fontStyle: "italic" }}>
                      This user hasn't added a bio yet.
                    </span>}
              </div>
            </div>

            {/* League Memberships Section */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ 
                color: "#bfc4d1", 
                fontWeight: 600, 
                fontSize: 18, 
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                🏆 League Memberships ({leagues.length})
              </div>
              {leagues.length > 0 ? (
                <div style={{ 
                  display: "grid", 
                  gap: 12,
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
                }}>
                  {leagues.map((league) => (
                    <div
                      key={league.id}
                      style={{
                        background: "linear-gradient(135deg, #23232b 60%, " + getGameTypeColor(league.game_type) + "20 120%)",
                        borderRadius: 12,
                        padding: "1rem",
                        border: "1px solid #2d3748",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => navigate(`/leagues/${league.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ 
                        fontSize: 18, 
                        fontWeight: 700, 
                        marginBottom: 8,
                        color: "#fff"
                      }}>
                        {league.name}
                      </div>
                      <div style={{ 
                        fontSize: 14, 
                        color: getGameTypeColor(league.game_type),
                        fontWeight: 600,
                        marginBottom: 4
                      }}>
                        {getGameTypeDisplay(league.game_type)}
                      </div>
                      <div style={{ 
                        fontSize: 12, 
                        color: "#8b9bb4",
                        marginBottom: 8
                      }}>
                        Joined {new Date(league.created_at).toLocaleDateString()}
                      </div>
                      {league.owner_id === profile.id && (
                        <div style={{
                          background: "#3b82f6",
                          color: "#fff",
                          borderRadius: 6,
                          padding: "2px 8px",
                          fontSize: 12,
                          fontWeight: 700,
                          display: "inline-block",
                        }}>
                          Commissioner
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  padding: 24,
                  background: "#23232b",
                  borderRadius: 12,
                  border: "1px solid #2d3748",
                  textAlign: "center",
                  color: "#8b9bb4",
                  fontStyle: "italic"
                }}>
                  This user hasn't joined any leagues yet.
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div style={{ 
              background: "#23232b", 
              borderRadius: 16, 
              padding: "1.5rem", 
              marginBottom: 24,
              border: "1px solid #2d3748"
            }}>
              <div style={{ 
                color: "#bfc4d1", 
                fontWeight: 600, 
                fontSize: 18, 
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                📊 Profile Stats
              </div>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: 16 
              }}>
                <div>
                  <div style={{ color: "#8b9bb4", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
                    Status
                  </div>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 600,
                    color: profile.is_active ? "#10b981" : "#ef4444"
                  }}>
                    {profile.is_active ? "🟢 Active" : "🔴 Inactive"}
                  </div>
                </div>
                
                <div>
                  <div style={{ color: "#8b9bb4", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
                    Verification
                  </div>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 600,
                    color: profile.is_verified ? "#10b981" : "#f59e0b"
                  }}>
                    {profile.is_verified ? "✅ Verified" : "⏳ Pending"}
                  </div>
                </div>
                
                <div>
                  <div style={{ color: "#8b9bb4", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
                    Role
                  </div>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 600,
                    color: profile.is_admin ? "#8b5cf6" : "#3b82f6"
                  }}>
                    {profile.is_admin ? "👑 Admin" : "👤 User"}
                  </div>
                </div>
                
                <div>
                  <div style={{ color: "#8b9bb4", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
                    User ID
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#bfc4d1" }}>
                    #{profile.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info (if viewing own profile) */}
            {user && user.id === profile.id && (
              <div style={{ 
                background: "#23232b", 
                borderRadius: 16, 
                padding: "1.5rem", 
                marginBottom: 24,
                border: "1px solid #2d3748"
              }}>
                <div style={{ 
                  color: "#bfc4d1", 
                  fontWeight: 600, 
                  fontSize: 18, 
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  📧 Contact Information
                </div>
                <div style={{ fontSize: 16, color: "#bfc4d1" }}>
                  {profile.email}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ 
              display: "flex", 
              gap: 12, 
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: "transparent",
                  color: "#bfc4d1",
                  border: "2px solid #4a5568",
                  borderRadius: 10,
                  padding: "12px 24px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "2px solid #3b82f6";
                  e.currentTarget.style.color = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "2px solid #4a5568";
                  e.currentTarget.style.color = "#bfc4d1";
                }}
              >
                ← Go Back
              </button>
              
              {/* Refresh button for own profile */}
              {user && user.id === profile.id && (
                <button
                  onClick={() => loadProfileData(true)}
                  disabled={loading}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#059669";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#10b981";
                    }
                  }}
                >
                  {loading ? "🔄 Refreshing..." : "🔄 Refresh"}
                </button>
              )}
              
              {user && user.id === profile.id && (
                <button
                  onClick={() => navigate('/profile')}
                  style={{
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#3b82f6";
                  }}
                >
                  ✏️ Edit My Profile
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PublicProfile;
