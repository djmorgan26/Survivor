import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TransitionSkeleton from "../components/TransitionSkeleton";
import { Link } from "react-router-dom";
import "../css/branding.css";

export default function Login() {
  const { login, loading, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (token) {
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1800);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await login(email, password);
    if (!ok) setError("Login failed. Please check your credentials.");
  };

  if (redirecting) {
    return <TransitionSkeleton />;
  }

  return (
    <div
      style={{
        background: "#101014",
        minHeight: "100vh",
        color: "#f5f6fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#18181c",
          borderRadius: 16,
          boxShadow: "0 4px 32px #0008",
          padding: "2.5rem 2rem 2rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: "2rem",
            marginBottom: 8,
            letterSpacing: ".02em",
            textAlign: "center",
          }}
        >
          Survivor Fantasy
        </h2>
        <form
          onSubmit={handleLogin}
          style={{
            width: "100%",
            maxWidth: 320,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <input
            type="email"
            style={{
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              padding: "1rem",
              borderRadius: 8,
              border: "1.5px solid #23232b",
              background: "#101014",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              marginBottom: 8,
              outline: "none",
              transition: "border 0.2s",
              display: "block",
            }}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            onFocus={(e) =>
              (e.currentTarget.style.border = "1.5px solid #3b82f6")
            }
            onBlur={(e) =>
              (e.currentTarget.style.border = "1.5px solid #23232b")
            }
          />
          <input
            type="password"
            style={{
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              padding: "1rem",
              borderRadius: 8,
              border: "1.5px solid #23232b",
              background: "#101014",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              marginBottom: 8,
              outline: "none",
              transition: "border 0.2s",
              display: "block",
            }}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onFocus={(e) =>
              (e.currentTarget.style.border = "1.5px solid #3b82f6")
            }
            onBlur={(e) =>
              (e.currentTarget.style.border = "1.5px solid #23232b")
            }
          />
          <button
            type="submit"
            style={{
              width: "50%",
              minWidth: 120,
              alignSelf: "center",
              boxSizing: "border-box",
              padding: "0.9rem",
              background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              border: "none",
              borderRadius: 8,
              boxShadow: "0 2px 8px #0003",
              marginTop: 8,
              cursor: "pointer",
              transition: "background 0.2s",
              display: "block",
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        {error && (
          <div style={{ color: "#ef4444", fontWeight: 600, marginTop: 4 }}>
            {error}
          </div>
        )}
        <div style={{ color: "#bfc4d1", fontSize: "1rem", marginTop: 8 }}>
          New here?{" "}
          <Link
            to="/register"
            style={{
              color: "#3b82f6",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
