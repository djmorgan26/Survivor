import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../css/modern-app.css";

export default function Home() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const [] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated]);

  return (
    <div
      className="homepage"
      style={{ background: "#101014", minHeight: "100vh", color: "#f5f6fa" }}
    >
      <Header user={user} token={token} logout={logout} />
      <main
        className="main"
        style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}
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
            Welcome to Survivor Fantasy
          </h2>
          <p style={{ color: "#bfc4d1", fontWeight: 500 }}>
            Draft. Compete. Survive. Outplay. Outlast.
          </p>
          <a
            href="/register"
            style={{
              display: "inline-block",
              marginTop: 24,
              padding: "0.8rem 2rem",
              background: "#fff",
              color: "#18181c",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "1.1rem",
              textDecoration: "none",
              boxShadow: "0 2px 8px #0002",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Get Started
          </a>
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
            Features
          </h3>
          <ul
            style={{
              background: "#18181c",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 2px 12px #0004",
              marginTop: 0,
            }}
          >
            <li
              style={{
                color: "#fff",
                borderBottom: "1px solid #23232b",
                padding: "0.7rem 0",
                fontWeight: 500,
              }}
            >
              Live Drafts
            </li>
            <li
              style={{
                color: "#fff",
                borderBottom: "1px solid #23232b",
                padding: "0.7rem 0",
                fontWeight: 500,
              }}
            >
              Player Stats
            </li>
            <li style={{ color: "#fff", padding: "0.7rem 0", fontWeight: 500 }}>
              Leaderboard
            </li>
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
