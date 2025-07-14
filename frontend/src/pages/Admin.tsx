import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import "../css/modern-app.css";

export default function Admin() {
  const { user, token, logout } = useAuth();
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
            Admin Dashboard
          </h2>
          <p style={{ color: "#bfc4d1", fontWeight: 500 }}>
            Manage users, leagues, and site settings. (Feature coming soon!)
          </p>
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
