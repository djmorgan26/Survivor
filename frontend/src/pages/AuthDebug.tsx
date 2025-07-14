import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { buildAuthUrl } from "../config/api";

export default function AuthDebug() {
  const { login, user, token, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("davidjmorgan26@gmail.com");
  const [password, setPassword] = useState("testpassword123");
  const [debugInfo, setDebugInfo] = useState<string>("");

  const testLogin = async () => {
    setDebugInfo("Testing login...");
    try {
      const success = await login(email, password);
      setDebugInfo(`Login result: ${success ? "SUCCESS" : "FAILED"}`);
    } catch (error) {
      setDebugInfo(`Login error: ${error}`);
    }
  };

  const testDirectAPI = async () => {
    setDebugInfo("Testing direct API call...");
    try {
      const response = await fetch(buildAuthUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      setDebugInfo(`Direct API response: ${response.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      setDebugInfo(`Direct API error: ${error}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Auth Debug</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <h3>Current State:</h3>
        <p>Loading: {loading.toString()}</p>
        <p>Authenticated: {isAuthenticated.toString()}</p>
        <p>User: {user ? JSON.stringify(user) : "null"}</p>
        <p>Token: {token ? "Present" : "null"}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Test Login:</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={testLogin} style={{ marginRight: "10px", padding: "5px" }}>
          Test Login
        </button>
        <button onClick={testDirectAPI} style={{ padding: "5px" }}>
          Test Direct API
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Debug Info:</h3>
        <pre style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
          {debugInfo}
        </pre>
      </div>

      <div>
        <h3>Environment:</h3>
        <p>VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL || "not set"}</p>
        <p>Auth URL: {buildAuthUrl("/auth/login")}</p>
      </div>
    </div>
  );
} 