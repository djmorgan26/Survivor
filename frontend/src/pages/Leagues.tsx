import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../css/modern-app.css";
import * as LeagueAPI from "../api/LeagueAPI";
import type { LeagueOut } from "../types/league";
import { useNavigate } from "react-router-dom";

export default function Leagues() {
  const { user, token, logout } = useAuth();
  const [leagues, setLeagues] = useState<LeagueOut[]>([]);
  const [leagueLoading, setLeagueLoading] = useState(false);
  const [leagueError, setLeagueError] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [createName, setCreateName] = useState("");
  const [createType, setCreateType] = useState<
    "survivor" | "love_island" | "big_brother" | "traitors"
  >("survivor");
  const [createError, setCreateError] = useState("");
  const [joinError, setJoinError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's leagues
    if (!token) return;
    setLeagueLoading(true);
    setLeagueError("");
    LeagueAPI.getLeagues(token)
      .then(setLeagues)
      .catch((err) => setLeagueError(err.message))
      .finally(() => setLeagueLoading(false));
  }, [token]);

  return (
    <div
      className="homepage"
      style={{ background: "#101014", minHeight: "100vh", color: "#f5f6fa" }}
    >
      <Header user={user} token={token} logout={logout} />
      <main
        className="main"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1rem" }}
      >
        {/* --- Hero Section --- */}
        <section
          style={{
            background: "linear-gradient(135deg, #23232b 60%, #3b82f6 120%)",
            borderRadius: 18,
            padding: "2.5rem 1.5rem 2rem 1.5rem",
            marginBottom: 36,
            boxShadow: "0 2px 32px #0008",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#fff",
              fontSize: "2.5rem",
              fontWeight: 900,
              marginBottom: 10,
              letterSpacing: ".01em",
            }}
          >
            Reality Fantasy Leagues
          </h1>
          <p
            style={{
              color: "#bfc4d1",
              fontWeight: 500,
              fontSize: "1.2rem",
              marginBottom: 18,
            }}
          >
            Join, create, or explore leagues for Survivor and more. Compete with
            friends, try new game modes, and track your progress all season
            long!
          </p>
          <div
            style={{
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                background: "#3b82f6",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                border: "none",
                borderRadius: 10,
                padding: "0.9rem 2.2rem",
                boxShadow: "0 2px 12px #3b82f6aa",
                cursor: "pointer",
                marginBottom: 8,
                transition: "background 0.2s, color 0.2s",
              }}
              onClick={() =>
                document
                  .getElementById("join-league-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Join a League
            </button>
            <button
              style={{
                background: "#06b6d4",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                border: "none",
                borderRadius: 10,
                padding: "0.9rem 2.2rem",
                boxShadow: "0 2px 12px #06b6d4aa",
                cursor: "pointer",
                marginBottom: 8,
                transition: "background 0.2s, color 0.2s",
              }}
              onClick={() =>
                document
                  .getElementById("create-league-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Create a League
            </button>
          </div>
        </section>
        {/* --- Join League Section --- */}
        <section
          id="join-league-section"
          style={{
            background: "#18181c",
            borderRadius: 14,
            padding: "2rem 1.2rem",
            marginBottom: 32,
            boxShadow: "0 2px 16px #0006",
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Join a League
          </h2>
          <p style={{ color: "#bfc4d1", fontWeight: 500, marginBottom: 18 }}>
            Enter a join code to join a private or public league.
          </p>
          <form
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
            onSubmit={async (e) => {
              e.preventDefault();
              setJoinError("");
              if (!token) {
                setJoinError("You must be signed in to join a league.");
                return;
              }
              if (!joinCode) {
                setJoinError("Please enter a join code.");
                return;
              }
              try {
                await LeagueAPI.joinLeague(Number(joinCode), token);
                setJoinCode("");
                // Refresh leagues
                const updated = await LeagueAPI.getLeagues(token);
                setLeagues(updated);
              } catch (err: any) {
                setJoinError(err.message || "Failed to join league");
              }
            }}
          >
            <input
              type="text"
              placeholder="Enter join code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              style={{
                padding: "0.7rem 1.2rem",
                borderRadius: 8,
                border: "2px solid #23232b",
                background: "#101014",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                outline: "none",
                minWidth: 180,
              }}
            />
            <button
              type="submit"
              style={{
                background: "#3b82f6",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                border: "none",
                borderRadius: 8,
                padding: "0.7rem 1.8rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Join
            </button>
          </form>
          {joinError && (
            <div style={{ color: "#f87171", marginTop: 8 }}>{joinError}</div>
          )}
        </section>
        {/* --- Create League Section --- */}
        <section
          id="create-league-section"
          style={{
            background: "#18181c",
            borderRadius: 14,
            padding: "2rem 1.2rem",
            marginBottom: 32,
            boxShadow: "0 2px 16px #0006",
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Create a League
          </h2>
          <p style={{ color: "#bfc4d1", fontWeight: 500, marginBottom: 18 }}>
            Start a new league and invite friends to join.
          </p>
          <form
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
            onSubmit={async (e) => {
              e.preventDefault();
              setCreateError("");
              if (!token) {
                setCreateError("You must be signed in to create a league.");
                return;
              }
              if (!createName) {
                setCreateError("Please enter a league name.");
                return;
              }
              try {
                await LeagueAPI.createLeague(
                  { name: createName, game_type: createType },
                  token
                );
                setCreateName("");
                // Refresh leagues
                const updated = await LeagueAPI.getLeagues(token);
                setLeagues(updated);
              } catch (err: any) {
                setCreateError(err.message || "Failed to create league");
              }
            }}
          >
            <input
              type="text"
              placeholder="League name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              style={{
                padding: "0.7rem 1.2rem",
                borderRadius: 8,
                border: "2px solid #23232b",
                background: "#101014",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                outline: "none",
                minWidth: 180,
              }}
            />
            <select
              value={createType}
              onChange={(e) => setCreateType(e.target.value as any)}
              style={{
                padding: "0.7rem 1.2rem",
                borderRadius: 8,
                border: "2px solid #23232b",
                background: "#101014",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                outline: "none",
                minWidth: 120,
              }}
            >
              <option value="survivor">Survivor</option>
              <option value="love_island">Love Island</option>
              <option value="big_brother">Big Brother</option>
              <option value="traitors">The Traitors</option>
            </select>
            <button
              type="submit"
              style={{
                background: "#06b6d4",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                border: "none",
                borderRadius: 8,
                padding: "0.7rem 1.8rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Create League
            </button>
          </form>
          {createError && (
            <div style={{ color: "#f87171", marginTop: 8 }}>{createError}</div>
          )}
        </section>
        {/* --- Your Leagues Section --- */}
        <section
          style={{
            background: "#18181c",
            borderRadius: 14,
            padding: "2rem 1.2rem",
            marginBottom: 32,
            boxShadow: "0 2px 16px #0006",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Your Leagues
          </h2>
          <p style={{ color: "#bfc4d1", fontWeight: 500, marginBottom: 18 }}>
            See the leagues you have joined or created.
          </p>
          {leagueLoading ? (
            <div>Loading leagues...</div>
          ) : leagueError ? (
            <div style={{ color: "#f87171" }}>{leagueError}</div>
          ) : leagues.length === 0 ? (
            <div>No leagues found.</div>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 18,
                justifyContent: "center",
              }}
            >
              {leagues.map((league) => (
                <div
                  key={league.id}
                  style={{
                    background:
                      league.game_type === "survivor"
                        ? "linear-gradient(135deg, #23232b 60%, #3b82f6 120%)"
                        : league.game_type === "love_island"
                        ? "linear-gradient(135deg, #23232b 60%, #06b6d4 120%)"
                        : league.game_type === "big_brother"
                        ? "linear-gradient(135deg, #23232b 60%, #f59e42 120%)"
                        : "linear-gradient(135deg, #23232b 60%, #a855f7 120%)",
                    borderRadius: 12,
                    padding: "1.2rem 1.5rem",
                    minWidth: 220,
                    maxWidth: 320,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    boxShadow: "0 2px 12px #0006",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}
                  >
                    {league.name}
                  </span>
                  <span
                    style={{
                      color: "#bfc4d1",
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    {league.game_type
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
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
                      marginTop: 4,
                    }}
                    onClick={() => navigate(`/leagues/${league.id}`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* --- Game Options Section --- */}
        <section
          style={{
            background: "#18181c",
            borderRadius: 14,
            padding: "2rem 1.2rem",
            marginBottom: 32,
            boxShadow: "0 2px 16px #0006",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Game Options
          </h2>
          <p
            style={{
              color: "#bfc4d1",
              fontWeight: 500,
              marginBottom: 18,
            }}
          >
            Choose a league type or try a new way to play.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, #23232b 60%, #3b82f6 120%)",
                borderRadius: 12,
                padding: "1.2rem 1.5rem",
                minWidth: 220,
                maxWidth: 320,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                boxShadow: "0 2px 12px #0006",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  marginBottom: 6,
                }}
              >
                Classic Draft
              </span>
              <span
                style={{
                  color: "#bfc4d1",
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                Snake draft, manage your team, score each week.
              </span>
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
                  marginTop: 4,
                }}
              >
                Learn More
              </button>
            </div>
            <div
              style={{
                background:
                  "linear-gradient(135deg, #23232b 60%, #06b6d4 120%)",
                borderRadius: 12,
                padding: "1.2rem 1.5rem",
                minWidth: 220,
                maxWidth: 320,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                boxShadow: "0 2px 12px #0006",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  marginBottom: 6,
                }}
              >
                Pick'em
              </span>
              <span
                style={{
                  color: "#bfc4d1",
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                Pick weekly winners, no draft required.
              </span>
              <button
                style={{
                  background: "#06b6d4",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.5rem 1.2rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "1rem",
                  marginTop: 4,
                }}
              >
                Learn More
              </button>
            </div>
            <div
              style={{
                background:
                  "linear-gradient(135deg, #23232b 60%, #f59e42 120%)",
                borderRadius: 12,
                padding: "1.2rem 1.5rem",
                minWidth: 220,
                maxWidth: 320,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                boxShadow: "0 2px 12px #0006",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  marginBottom: 6,
                }}
              >
                Custom League
              </span>
              <span
                style={{
                  color: "#bfc4d1",
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                Set your own rules, scoring, and format.
              </span>
              <button
                style={{
                  background: "#f59e42",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.5rem 1.2rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "1rem",
                  marginTop: 4,
                }}
              >
                Learn More
              </button>
            </div>
            {/* Add more game option cards here */}
          </div>
        </section>
      </main>
      <footer
        className="footer"
        style={{
          background: "#18181c",
          color: "#bfc4d1",
          textAlign: "center",
          padding: "1.2rem 0",
          marginTop: 40,
          borderTop: "1px solid #23232b",
        }}
      >
        <p>© 2025 Survivor Fantasy. All rights reserved.</p>
      </footer>
    </div>
  );
}
