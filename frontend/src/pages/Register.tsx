import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../css/branding.css";

// Email regex for basic format validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Registration failed.");
        return;
      }
      setSuccess("Registration successful! Logging you in...");
      await login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

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
          Create Account
        </h2>
        <form
          onSubmit={handleRegister}
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
            type="text"
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
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            onFocus={(e) =>
              (e.currentTarget.style.border = "1.5px solid #3b82f6")
            }
            onBlur={(e) =>
              (e.currentTarget.style.border = "1.5px solid #23232b")
            }
            autoComplete="off"
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
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              width: "100%",
              padding: "1rem 0",
              background: "linear-gradient(90deg, #3b82f6 60%, #06b6d4 120%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              border: "none",
              borderRadius: 10,
              boxShadow: "0 2px 8px #3b82f6aa",
              marginTop: 8,
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Sign Up
          </button>
        </form>
        {error && (
          <div
            style={{
              color: "#ef4444",
              textAlign: "center",
              marginTop: 12,
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              color: "#22c55e",
              textAlign: "center",
              marginTop: 12,
            }}
          >
            {success}
          </div>
        )}
        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            color: "#bfc4d1",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#3b82f6",
              textDecoration: "underline",
            }}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
