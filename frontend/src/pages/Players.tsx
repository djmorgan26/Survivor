import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import TransitionSkeleton from "../components/TransitionSkeleton";
import "../css/modern-app.css";

interface SurvivorPlayer {
  castaway_id: string;
  season: number;
  version?: string;
  castaway: string;
  age: number;
  occupation: string;
  result: string;
  day: number;
  original_tribe: string;
}

interface SurvivorSeason {
  season: number;
  season_name: string;
  location: string;
  version?: string;
}

export default function Players() {
  const { user, token, logout } = useAuth();
  const [season, setSeason] = useState<number | null>(null);
  const [version, setVersion] = useState<string>("US");
  const [players, setPlayers] = useState<SurvivorPlayer[]>([]);
  const [seasons, setSeasons] = useState<SurvivorSeason[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    async function fetchSeasons() {
      setLoading(true);
      try {
        const res = await fetch("/api/survivor/seasons");
        const data = await res.json();
        setSeasons(data);
        setSeason(data[0]?.season || null);
        setVersion(data[0]?.version || "US");
      } catch {
        setError("Failed to load seasons");
      } finally {
        setLoading(false);
      }
    }
    fetchSeasons();
  }, []);

  useEffect(() => {
    if (!season || !version) return;
    async function fetchPlayers() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/survivor/players?season=${season}&version=${version}`
        );
        const data = await res.json();
        setPlayers(data);
      } catch {
        setError("Failed to load players");
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, [season, version]);

  useEffect(() => {
    // Only redirect if token is missing and not loading, and only after seasons are loaded
    if (!token && !loading && seasons.length > 0) {
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1800);
    }
  }, [token, loading, seasons]);

  if (redirecting) {
    return <TransitionSkeleton />;
  }

  return (
    <div
      className="homepage"
      style={{
        background: "#101014",
        minHeight: "100vh",
        color: "#f5f6fa",
      }}
    >
      <Header user={user} token={token} logout={logout} />
      <main
        className="main"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <section
          className="hero"
          style={{
            background: "#18181c",
            borderRadius: 12,
            padding: "2rem 1rem",
            marginBottom: 32,
            boxShadow: "0 2px 16px #0006",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Players
          </h2>
          <p
            style={{
              color: "#bfc4d1",
              fontWeight: 500,
            }}
          >
            Browse all Survivor players by season and tribe.
          </p>
        </section>
        <section className="features">
          <h3
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.3rem",
              marginBottom: 16,
            }}
          >
            Player List
          </h3>
          <div
            className="season-selector"
            style={{
              marginBottom: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <label
              htmlFor="season-select"
              style={{
                color: "#bfc4d1",
                fontWeight: 600,
                fontSize: "1.1rem",
                marginBottom: 8,
              }}
            >
              Select a Season:
            </label>
            <select
              id="season-select"
              style={{
                width: 260,
                padding: "0.7rem 1.2rem",
                borderRadius: 8,
                border: "2px solid #23232b",
                background: "#101014",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: "0 2px 8px #0003",
                outline: "none",
                marginBottom: 0,
                transition: "border 0.2s, background 0.2s, color 0.2s",
              }}
              value={season ?? ""}
              onChange={(e) => {
                const selected = seasons.find(
                  (s) => s.season === Number(e.target.value)
                );
                setSeason(selected ? selected.season : null);
                setVersion(selected?.version || "US");
              }}
              onFocus={(e) =>
                (e.currentTarget.style.border = "2px solid #3b82f6")
              }
              onBlur={(e) =>
                (e.currentTarget.style.border = "2px solid #23232b")
              }
            >
              {seasons.map((s) => (
                <option
                  key={s.season}
                  value={s.season}
                  style={{
                    background: "#fff",
                    color: "#18181c",
                    fontWeight: 600,
                  }}
                >
                  {s.season_name} ({s.location})
                </option>
              ))}
            </select>
          </div>
          {loading && (
            <div
              className="profile-loading"
              style={{
                color: "#3b82f6",
                fontWeight: 600,
              }}
            >
              Loading players...
            </div>
          )}
          {error && (
            <div
              className="profile-error"
              style={{
                color: "#ef4444",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
          <ul
            style={{
              background: "#18181c",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 2px 12px #0004",
              marginTop: 0,
            }}
          >
            {players.map((player) => (
              <li
                key={player.castaway_id}
                style={{
                  color: "#fff",
                  borderBottom: "1px solid #23232b",
                  padding: "0.7rem 0",
                  fontWeight: 500,
                }}
              >
                <strong style={{ color: "#3b82f6" }}>{player.castaway}</strong>{" "}
                <span style={{ color: "#bfc4d1" }}>
                  ({player.original_tribe} Tribe)
                </span>
              </li>
            ))}
          </ul>
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
