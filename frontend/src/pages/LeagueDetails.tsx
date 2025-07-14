import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeagues, getLeagueMembers } from "../api/LeagueAPI";
import { getUserPublicProfile } from "../api/UserAPI";
import type { LeagueOut, LeagueMembershipOut } from "../types/league";
import { useAuth } from "../context/AuthContext";
import survivorLogo from "../assets/survivor_frame.webp"; // Use your Survivor logo or image here
import Header from "../components/Header";

const bgGradient = "linear-gradient(135deg, #23232b 60%, #3b82f6 120%)";

const LeagueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [league, setLeague] = useState<LeagueOut | null>(null);
  const [members, setMembers] = useState<LeagueMembershipOut[]>([]);
  const [memberProfiles, setMemberProfiles] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getLeagues(token)
      .then((leagues) => {
        const found = leagues.find((l) => l.id === Number(id));
        setLeague(found || null);
        if (found) {
          getLeagueMembers(found.id, token)
            .then(async (members) => {
              setMembers(members);
              // Fetch public profiles for all members
              const profiles: Record<number, any> = {};
              await Promise.all(
                members.map(async (m) => {
                  try {
                    const profile = await getUserPublicProfile(m.user_id);
                    profiles[m.user_id] = profile;
                  } catch {
                    profiles[m.user_id] = null;
                  }
                })
              );
              setMemberProfiles(profiles);
            })
            .catch(() => setMembers([]));
        }
      })
      .catch(() => setError("Failed to load league info."))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (!token)
    return (
      <div className="text-center mt-10 text-lg">
        Sign in to view league details.
      </div>
    );
  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error || !league)
    return (
      <div className="text-center mt-10 text-red-500">
        {error || "League not found."}
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgGradient,
        padding: 0,
      }}
    >
      <Header user={user} token={token} logout={logout} />
      <div
        style={{
          maxWidth: 700,
          margin: "48px auto 0 auto",
          background: "#18181c",
          borderRadius: 18,
          boxShadow: "0 2px 24px #0008",
          padding: "2.5rem 2rem 2rem 2rem",
          color: "#f5f6fa",
          position: "relative",
        }}
      >
        <img
          src={survivorLogo}
          alt="Survivor Logo"
          style={{
            width: 120,
            position: "absolute",
            top: -60,
            left: "50%",
            transform: "translateX(-50%)",
            filter: "drop-shadow(0 2px 8px #0008)",
            background: "#23232b",
            borderRadius: "50%",
            padding: 8,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: 1 }}>
            {league.name}
          </h1>
          <button
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
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            marginBottom: 32,
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 15 }}>
              Game Type
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 10,
                textTransform: "capitalize",
              }}
            >
              {league.game_type.replace("_", " ")}
            </div>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 15 }}>
              Owner ID
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
              {league.owner_id}
            </div>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 15 }}>
              Created
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
              {new Date(league.created_at).toLocaleString()}
            </div>
            <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 15 }}>
              Join Code
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                fontFamily: "monospace",
                background: "#23232b",
                borderRadius: 8,
                padding: "4px 12px",
                display: "inline-block",
                marginBottom: 10,
              }}
            >
              {league.join_code}
            </div>
          </div>
          {league.settings && (
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ color: "#bfc4d1", fontWeight: 500, fontSize: 15 }}>
                Settings
              </div>
              <div
                style={{
                  background: "#23232b",
                  borderRadius: 8,
                  padding: 16,
                  marginTop: 8,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  Max Members:{" "}
                  <span style={{ fontWeight: 400 }}>
                    {league.settings.max_members}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  Private:{" "}
                  <span style={{ fontWeight: 400 }}>
                    {league.settings.is_private ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
            Members
          </h2>
          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              boxShadow: "0 1px 8px #0004",
            }}
          >
            <table
              style={{ width: "100%", background: "#20202a", borderRadius: 8 }}
            >
              <thead>
                <tr style={{ background: "#23232b" }}>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      color: "#bfc4d1",
                      fontWeight: 700,
                    }}
                  >
                    User ID
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      color: "#bfc4d1",
                      fontWeight: 700,
                    }}
                  >
                    Role
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      color: "#bfc4d1",
                      fontWeight: 700,
                    }}
                  >
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        textAlign: "center",
                        padding: 24,
                        color: "#bfc4d1",
                      }}
                    >
                      No members yet.
                    </td>
                  </tr>
                ) : (
                  members.map((m) => {
                    const profile = memberProfiles[m.user_id];
                    return (
                      <tr
                        key={m.id}
                        style={{ cursor: "pointer", background: "#23232b" }}
                        onClick={() => navigate(`/users/${m.user_id}`)}
                      >
                        <td
                          style={{
                            padding: "10px 16px",
                            borderBottom: "1px solid #23232b",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <img
                            src={
                              profile?.profile_picture_url || "/default-avatar.png"
                            }
                            alt="Profile"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #3b82f6",
                            }}
                          />
                          <span>
                            {profile?.display_name || profile?.username || m.user_id}
                          </span>
                          {league.owner_id === m.user_id && (
                            <span
                              style={{
                                marginLeft: 8,
                                background: "#3b82f6",
                                color: "#fff",
                                borderRadius: 6,
                                padding: "2px 8px",
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              Commissioner
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "10px 16px",
                            borderBottom: "1px solid #23232b",
                            textTransform: "capitalize",
                          }}
                        >
                          {m.role}
                        </td>
                        <td
                          style={{
                            padding: "10px 16px",
                            borderBottom: "1px solid #23232b",
                          }}
                        >
                          {new Date(m.joined_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueDetails;
