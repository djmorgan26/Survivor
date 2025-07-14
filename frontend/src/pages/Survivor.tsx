import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import survivorFrame from "../assets/survivor_frame.webp";

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

export default function SurvivorPage() {
  const { user, token, logout } = useAuth();
  // Section selector state
  const [section, setSection] = useState<"news" | "graphics" | "players">(
    "news"
  );

  // Players logic (from Players.tsx)
  const [season, setSeason] = useState<number | null>(null);
  const [version, setVersion] = useState<string>("US");
  const [players, setPlayers] = useState<SurvivorPlayer[]>([]);
  const [seasons, setSeasons] = useState<SurvivorSeason[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <div
      style={{
        background: "#101014",
        minHeight: "100vh",
        color: "#f5f6fa",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <Header user={user} token={token} logout={logout} />
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "2.5rem 0.5rem",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: "2.2rem",
            marginBottom: 8,
            letterSpacing: "0.04em",
            textAlign: "center",
          }}
        >
          Survivor Central
        </h1>
        {/* Section Selector */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 32,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setSection("news")}
            style={{
              background: section === "news" ? "#3b82f6" : "#23232b",
              color: section === "news" ? "#fff" : "#bfc4d1",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "1.1rem",
              padding: "0.7rem 1.5rem",
              cursor: "pointer",
              boxShadow:
                section === "news" ? "0 2px 8px #3b82f6aa" : "0 2px 8px #0003",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            News & Updates
          </button>
          <button
            onClick={() => setSection("graphics")}
            style={{
              background: section === "graphics" ? "#3b82f6" : "#23232b",
              color: section === "graphics" ? "#fff" : "#bfc4d1",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "1.1rem",
              padding: "0.7rem 1.5rem",
              cursor: "pointer",
              boxShadow:
                section === "graphics"
                  ? "0 2px 8px #3b82f6aa"
                  : "0 2px 8px #0003",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Featured Graphics
          </button>
          <button
            onClick={() => setSection("players")}
            style={{
              background: section === "players" ? "#3b82f6" : "#23232b",
              color: section === "players" ? "#fff" : "#bfc4d1",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "1.1rem",
              padding: "0.7rem 1.5rem",
              cursor: "pointer",
              boxShadow:
                section === "players"
                  ? "0 2px 8px #3b82f6aa"
                  : "0 2px 8px #0003",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Players
          </button>
        </div>
        {/* Section Content */}
        {section === "news" && (
          <section
            style={{
              width: "100%",
              maxWidth: 900,
              background: "#18181c",
              borderRadius: 18,
              boxShadow: "0 2px 24px #0008",
              marginBottom: 32,
              padding: "2rem 1.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                color: "#3b82f6",
                fontWeight: 800,
                fontSize: "1.5rem",
                marginBottom: 10,
              }}
            >
              News & Updates
            </h2>
            <div
              style={{
                width: "100%",
                minHeight: 80,
                color: "#bfc4d1",
                fontWeight: 500,
                fontSize: "1.1rem",
                textAlign: "center",
                border: "1px dashed #3b82f6",
                borderRadius: 12,
                padding: 18,
                background: "#15151a",
                marginBottom: 18,
              }}
            >
              {/* TODO: Replace with live news/updates */}
              <span>Stay tuned for the latest Survivor news and updates!</span>
            </div>
          </section>
        )}
        {section === "graphics" && (
          <section
            style={{
              width: "100%",
              maxWidth: 900,
              background: "#18181c",
              borderRadius: 18,
              boxShadow: "0 2px 24px #0008",
              marginBottom: 32,
              padding: "2rem 1.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                color: "#3b82f6",
                fontWeight: 800,
                fontSize: "1.5rem",
                marginBottom: 10,
              }}
            >
              Featured Graphics
            </h2>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: 18,
                justifyContent: "center",
              }}
            >
              <img
                src={survivorFrame}
                alt="Survivor Featured Graphic"
                style={{
                  width: 180,
                  height: 110,
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px #0006",
                  display: "block",
                }}
              />
              {/* Template graphics - replace with your own assets */}
              <div
                style={{
                  width: 180,
                  height: 110,
                  background: "#23232b",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#bfc4d1",
                  fontWeight: 700,
                  fontSize: 18,
                  boxShadow: "0 2px 8px #0006",
                }}
              >
                Survivor Logo
              </div>
              <div
                style={{
                  width: 180,
                  height: 110,
                  background: "#23232b",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#bfc4d1",
                  fontWeight: 700,
                  fontSize: 18,
                  boxShadow: "0 2px 8px #0006",
                }}
              >
                Cast Photo
              </div>
              <div
                style={{
                  width: 180,
                  height: 110,
                  background: "#23232b",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#bfc4d1",
                  fontWeight: 700,
                  fontSize: 18,
                  boxShadow: "0 2px 8px #0006",
                }}
              >
                Tribe Map
              </div>
            </div>
          </section>
        )}
        {section === "players" && (
          <section
            style={{
              width: "100%",
              maxWidth: 900,
              background: "#18181c",
              borderRadius: 18,
              boxShadow: "0 2px 24px #0008",
              marginBottom: 32,
              padding: "2rem 1.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                color: "#3b82f6",
                fontWeight: 800,
                fontSize: "1.5rem",
                marginBottom: 10,
              }}
            >
              Players
            </h2>
            <p style={{ color: "#bfc4d1", fontWeight: 500 }}>
              Browse all Survivor players by season and tribe.
            </p>
            <div
              style={{
                marginBottom: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: 400,
              }}
            >
              <label
                htmlFor="version-select"
                style={{
                  color: "#bfc4d1",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  marginBottom: 8,
                  alignSelf: "flex-start",
                }}
              >
                Select a Version:
              </label>
              <select
                id="version-select"
                value={version}
                onChange={(e) => {
                  setVersion(e.target.value);
                  // Set season to first available for this version
                  const firstSeason = seasons.find(
                    (s) => (s.version || "US") === e.target.value
                  );
                  setSeason(firstSeason ? firstSeason.season : null);
                }}
                style={{
                  width: "100%",
                  padding: "0.7rem 1.2rem",
                  borderRadius: 8,
                  border: dropdownOpen
                    ? "2px solid #3b82f6"
                    : "2px solid #23232b",
                  background: "#101014",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow: "0 2px 8px #0003",
                  outline: "none",
                  marginBottom: 16,
                  transition: "border 0.2s, background 0.2s, color 0.2s",
                  cursor: "pointer",
                }}
              >
                {[...new Set(seasons.map((s) => s.version || "US"))].map(
                  (v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  )
                )}
              </select>
              <label
                htmlFor="season-select"
                style={{
                  color: "#bfc4d1",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  marginBottom: 8,
                  alignSelf: "flex-start",
                }}
              >
                Select a Season:
              </label>
              <select
                id="season-select"
                value={season ?? ""}
                onChange={(e) => setSeason(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "0.7rem 1.2rem",
                  borderRadius: 8,
                  border: dropdownOpen
                    ? "2px solid #3b82f6"
                    : "2px solid #23232b",
                  background: "#101014",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow: "0 2px 8px #0003",
                  outline: "none",
                  marginBottom: 0,
                  transition: "border 0.2s, background 0.2s, color 0.2s",
                  cursor: "pointer",
                }}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
              >
                {seasons
                  .filter((s) => (s.version || "US") === version)
                  .map((s) => (
                    <option
                      key={`${s.season}-${s.version || "US"}`}
                      value={s.season}
                    >
                      {s.season_name} ({s.location})
                    </option>
                  ))}
              </select>
              {season && (
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      background: "#3b82f6",
                      color: "#fff",
                      borderRadius: 16,
                      padding: "0.3rem 1rem",
                      fontWeight: 700,
                      fontSize: "1rem",
                      display: "inline-block",
                    }}
                  >
                    {
                      seasons.find(
                        (s) =>
                          s.season === season && (s.version || "US") === version
                      )?.season_name
                    }
                    <span style={{ color: "#7dd3fc" }}>
                      {
                        seasons.find(
                          (s) =>
                            s.season === season &&
                            (s.version || "US") === version
                        )?.location
                      }
                    </span>
                  </span>
                </div>
              )}
            </div>
            {loading && (
              <div style={{ color: "#3b82f6", fontWeight: 600 }}>
                Loading players...
              </div>
            )}
            {error && (
              <div style={{ color: "#ef4444", fontWeight: 600 }}>{error}</div>
            )}
            <ul
              style={{
                background: "#18181c",
                borderRadius: 10,
                padding: 24,
                boxShadow: "0 2px 12px #0004",
                marginTop: 0,
                width: "100%",
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
                  <strong style={{ color: "#3b82f6" }}>
                    {player.castaway}
                  </strong>{" "}
                  <span style={{ color: "#bfc4d1" }}>
                    ({player.original_tribe} Tribe)
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
