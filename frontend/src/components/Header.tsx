import React, { useState } from "react";

interface HeaderProps {
  user: { username: string } | null;
  token: string | null;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, token, logout }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Responsive styles
  const headerStyle: React.CSSProperties = {
    background: "#18181c",
    borderBottom: "1px solid #23232b",
    color: "#fff",
    boxShadow: "0 2px 8px #0004",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    position: "relative",
    zIndex: 100,
    maxWidth: "100vw",
  };
  const navStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 24,
    marginLeft: 0, // flush left
    flex: 1,
  };
  const mobileNavStyle: React.CSSProperties = {
    display: mobileNavOpen ? "flex" : "none",
    flexDirection: "column",
    position: window.innerWidth <= 700 ? "fixed" : "absolute",
    top: window.innerWidth <= 700 ? 64 : "100%",
    left: 0,
    width: "100vw",
    maxWidth: "100vw",
    background: "#18181c",
    boxShadow: "0 2px 16px #0008",
    padding: "1rem 0 1.5rem 0",
    zIndex: window.innerWidth <= 700 ? 300 : 99,
    gap: 12,
    overflowX: "hidden",
  };
  const hamburgerStyle: React.CSSProperties = {
    display: "none",
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 26, // smaller for better fit
    cursor: "pointer",
    marginLeft: 8,
    padding: "4px 8px", // add some padding for touch
    borderRadius: 6,
    lineHeight: 1,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    position: "relative",
  };
  // Show hamburger on small screens
  const mediaQuery = `@media (max-width: 700px) {\n  .header-nav { display: none !important; }\n  .header-hamburger { display: flex !important; align-items: center !important; justify-content: center !important; position: absolute !important; right: 0.7rem !important; top: 50% !important; transform: translateY(-50%) !important; margin: 0 !important; height: 40px !important; width: 40px !important; font-size: 26px !important; z-index: 201 !important; }\n  .header-logo { font-size: 1.3rem !important; margin-right: 12px !important; }\n  .header { padding: 0 0.7rem !important; max-width: 100vw !important; overflow-x: hidden !important; }\n  .header-mobile-nav { max-width: 100vw !important; overflow-x: hidden !important; z-index: 300 !important; position: fixed !important; left: 0 !important; top: 64px !important; }\n}`;

  return (
    <>
      <style>{mediaQuery}</style>
      <header className="header" style={headerStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            position: "relative",
            minHeight: 64,
            padding: "0.2rem 0",
            zIndex: 101,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <h1
              className="header-logo"
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: "2rem",
                letterSpacing: "0.04em",
                marginRight: 28,
                cursor: "pointer",
                transition: "color 0.2s",
                lineHeight: 1.1,
              }}
              onClick={() => (window.location.href = "/")}
            >
              Survivor Fantasy League
            </h1>
            <nav className="header-nav" style={navStyle}>
              <a
                href="/dashboard"
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                Dashboard
              </a>
              <a
                href="/leagues"
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                Leagues
              </a>
              <a
                href="/players"
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                Players
              </a>
              <a
                href="/profile"
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                Profile
              </a>
            </nav>
          </div>
          <button
            className="header-hamburger"
            style={hamburgerStyle}
            aria-label="Open navigation menu"
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
        {/* Mobile Nav */}
        <nav className="header-mobile-nav" style={mobileNavStyle}>
          {user && token && (
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                padding: 12,
                borderBottom: "1px solid #23232b",
                width: "100%",
                textAlign: "left",
              }}
            >
              {user.username}
            </div>
          )}
          <a
            href="/dashboard"
            style={{
              color: "#fff",
              fontWeight: 600,
              padding: 12,
            }}
            onClick={() => setMobileNavOpen(false)}
          >
            Dashboard
          </a>
          <a
            href="/leagues"
            style={{
              color: "#fff",
              fontWeight: 600,
              padding: 12,
            }}
            onClick={() => setMobileNavOpen(false)}
          >
            Leagues
          </a>
          <a
            href="/players"
            style={{
              color: "#fff",
              fontWeight: 600,
              padding: 12,
            }}
            onClick={() => setMobileNavOpen(false)}
          >
            Players
          </a>
          <a
            href="/profile"
            style={{
              color: "#fff",
              fontWeight: 600,
              padding: 12,
            }}
            onClick={() => setMobileNavOpen(false)}
          >
            Profile
          </a>
          {user && token ? (
            <button
              onClick={() => {
                setMobileNavOpen(false);
                logout();
              }}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "#ef4444",
                fontWeight: 700,
                padding: "0.8rem 1.2rem",
                textAlign: "left",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background 0.2s, color 0.2s",
                marginTop: 8,
              }}
            >
              Sign Out
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
                marginTop: 8,
              }}
            >
              <a
                href="/login"
                style={{
                  background: "#23232b",
                  color: "#bfc4d1",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderRadius: 7,
                  padding: "0.7rem 1.1rem",
                  fontSize: "1.1rem",
                  border: "1.5px solid #3b82f6",
                  width: "100%",
                  maxWidth: 340,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "none",
                  marginBottom: 8,
                  transition: "background 0.2s, color 0.2s, border 0.2s",
                  whiteSpace: "nowrap",
                  minWidth: 80,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onClick={() => setMobileNavOpen(false)}
              >
                Login
              </a>
              <a
                href="/register"
                style={{
                  background: "#23232b",
                  color: "#bfc4d1",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderRadius: 7,
                  padding: "0.7rem 1.1rem",
                  fontSize: "1.1rem",
                  border: "1.5px solid #06b6d4",
                  width: "100%",
                  maxWidth: 340,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "none",
                  marginBottom: 0,
                  transition: "background 0.2s, color 0.2s, border 0.2s",
                  whiteSpace: "nowrap",
                  minWidth: 80,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onClick={() => setMobileNavOpen(false)}
              >
                Sign Up
              </a>
            </div>
          )}
        </nav>
        {/* Desktop profile dropdown (hidden on mobile) */}
        <div
          className="header-profile-desktop"
          style={{
            color: "#bfc4d1",
            fontWeight: 600,
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {user && token ? (
            <div style={{ position: "relative" }}>
              <button
                style={{
                  background: "none",
                  color: "#fff",
                  border: "none",
                  borderRadius: 0,
                  fontWeight: 700,
                  padding: 0,
                  cursor: "pointer",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  minWidth: 100,
                  boxShadow: "none",
                }}
                onClick={() => setProfileMenuOpen((v) => !v)}
                onBlur={() => setTimeout(() => setProfileMenuOpen(false), 150)}
                tabIndex={0}
              >
                <span style={{ marginRight: 0 }}>{user.username}</span>
              </button>
              {profileMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "120%",
                    right: 0,
                    background: "#23232b",
                    borderRadius: 8,
                    boxShadow: "0 2px 12px #0007",
                    minWidth: 160,
                    zIndex: 99999,
                    padding: 0,
                    marginTop: 4,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <button
                    onClick={logout}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      fontWeight: 700,
                      padding: "0.8rem 1.2rem",
                      textAlign: "left",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: "1rem",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <a
                href="/login"
                style={{
                  background: "#23232b",
                  color: "#bfc4d1",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderRadius: 7,
                  padding: "0.5rem 1.1rem",
                  fontSize: "1rem",
                  border: "1.5px solid #3b82f6",
                  marginRight: 10,
                  marginLeft: 0,
                  display: "inline-block",
                  boxShadow: "none",
                  transition: "background 0.2s, color 0.2s, border 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                Log In
              </a>
              <a
                href="/register"
                style={{
                  background: "#23232b",
                  color: "#bfc4d1",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderRadius: 7,
                  padding: "0.5rem 1.1rem",
                  fontSize: "1rem",
                  border: "1.5px solid #06b6d4",
                  marginLeft: 0,
                  display: "inline-block",
                  boxShadow: "none",
                  transition: "background 0.2s, color 0.2s, border 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </header>
      {/* Hide desktop profile dropdown on mobile */}
      <style>{`
        @media (max-width: 700px) {
          .header-profile-desktop { display: none !important; }
          .header-hamburger { display: block !important; position: absolute !important; right: 0.7rem !important; top: 50% !important; transform: translateY(-50%) !important; margin: 0 !important; height: 40px !important; width: 40px !important; font-size: 26px !important; }
        }
        @media (min-width: 701px) {
          .header-mobile-nav { display: none !important; position: absolute !important; z-index: 99 !important; }
        }
      `}</style>
    </>
  );
};

export default Header;
