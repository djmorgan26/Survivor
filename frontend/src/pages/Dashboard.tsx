import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import "../css/modern-app.css";
import survivorFrame from "../assets/survivor_frame.webp";
import bigBrotherFrame from "../assets/big_brother_frame.jpg";
import loveIslandFrame from "../assets/love_island_frame.jpg";
import theTraitorsFrame from "../assets/the_traitors_frame.jpg";

interface DashboardStats {
  leagues_joined: number;
  total_points: number;
  rank: string | number;
}

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    leagues_joined: 0,
    total_points: 0,
    rank: "-",
  });

  // --- Gallery Carousel Logic ---
  const galleryImages = [
    {
      src: survivorFrame,
      alt: "Survivor Island",
      label: "Survivor",
    },
    {
      src: loveIslandFrame,
      alt: "Love Island Beach",
      label: "Love Island",
    },
    {
      src: bigBrotherFrame,
      alt: "Big Brother House",
      label: "Big Brother",
    },
    {
      src: theTraitorsFrame,
      alt: "The Traitors Castle",
      label: "The Traitors",
    },
    // Add your own assets here!
  ];
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance every 2 seconds
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % galleryImages.length);
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [galleryImages.length]);

  // Manual navigation
  const goNext = () => setCurrent((prev) => (prev + 1) % galleryImages.length);
  const goPrev = () =>
    setCurrent(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );

  useEffect(() => {
    async function fetchStats() {
      try {
        // Placeholder for user stats API
        setStats({
          leagues_joined: 0,
          total_points: 0,
          rank: "-",
        });
      } catch (err) {
        console.error("Could not load dashboard stats.");
      }
    }
    if (token) fetchStats();
  }, [token]);

  return (
    <div
      className="homepage"
      style={{
        background: "#101014",
        minHeight: "100vh",
        color: "#f5f6fa",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <Header user={user} token={token} logout={logout} />
      {/* --- Gallery Carousel Section --- */}
      <section
        className="gallery-carousel"
        style={{
          width: "100%",
          maxWidth: 1100,
          margin: "32px auto 36px auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: 20,
          padding: "1.5rem 1vw 2.2rem 1vw",
          overflow: "hidden",
        }}
      >
        {/* Title and welcome */}
        <h2
          style={{
            color: "#fff",
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: 8,
            textAlign: "center",
            letterSpacing: "0.01em",
          }}
        >
          Dashboard
        </h2>
        <p
          style={{
            color: "#bfc4d1",
            fontWeight: 500,
            fontSize: "1.2rem",
            marginBottom: 18,
            textAlign: "center",
          }}
        >
          Welcome, {user?.username || "User"}!
        </p>
        <div
          style={{
            width: "100%",
            aspectRatio: "16/7",
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={galleryImages[current].src}
            alt={galleryImages[current].alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 16,
              transition: "opacity 0.5s cubic-bezier(.4,0,.2,1)",
              opacity: 1,
              minHeight: 180,
              maxHeight: 340,
              background: "#23232b",
              userSelect: "none",
              display: "block",
              margin: "0 auto",
            }}
            draggable={false}
          />
          {/* Label overlay always inside image for all screens */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              background: "rgba(24,24,28,0.82)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.25rem",
              padding: "0.7rem 1.2rem",
              textAlign: "left",
              letterSpacing: "0.01em",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              zIndex: 1,
              boxShadow: "0 2px 8px #0006",
            }}
          >
            {galleryImages[current].label}
          </div>
          {/* Prev Arrow */}
          <button
            aria-label="Previous"
            onClick={() => {
              goPrev();
              intervalRef.current && clearInterval(intervalRef.current);
            }}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(24,24,28,0.7)",
              border: "none",
              borderRadius: "50%",
              color: "#fff",
              fontSize: 28,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 2,
              boxShadow: "0 2px 8px #0006",
              transition: "background 0.2s",
            }}
          >
            &#8592;
          </button>
          {/* Next Arrow */}
          <button
            aria-label="Next"
            onClick={() => {
              goNext();
              intervalRef.current && clearInterval(intervalRef.current);
            }}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(24,24,28,0.7)",
              border: "none",
              borderRadius: "50%",
              color: "#fff",
              fontSize: 28,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 2,
              boxShadow: "0 2px 8px #0006",
              transition: "background 0.2s",
            }}
          >
            &#8594;
          </button>
        </div>
        {/* Dots for navigation */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {galleryImages.map((img, idx) => (
            <button
              key={img.label}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => {
                setCurrent(idx);
                intervalRef.current && clearInterval(intervalRef.current);
              }}
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                border: "none",
                background: idx === current ? "#3b82f6" : "#444",
                opacity: idx === current ? 1 : 0.5,
                cursor: "pointer",
                transition: "background 0.2s, opacity 0.2s",
                margin: 0,
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>
      {/* --- End Gallery Carousel --- */}
      <main
        className="main"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "2.5rem 0.5rem",
          minHeight: "calc(100vh - 120px)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <section
          className="features"
          style={{
            width: "100%",
            maxWidth: 1100,
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.5rem",
              marginBottom: 28,
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
          >
            Your Stats
          </h3>
          {/* Modern stat cards */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 28,
              justifyContent: "center",
              alignItems: "stretch",
              width: "100%",
              maxWidth: 900,
              margin: "0 auto 0 auto",
            }}
          >
            {/* Leagues Joined */}
            <div
              style={{
                flex: 1,
                minWidth: 220,
                maxWidth: 320,
                background:
                  "linear-gradient(135deg, #23232b 60%, #3b82f6 120%)",
                borderRadius: 22,
                boxShadow: "0 4px 32px #0007",
                padding: "2.1rem 1.5rem 1.5rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                border: "1.5px solid #2a2a36",
                backdropFilter: "blur(2.5px)",
                marginBottom: 0,
              }}
            >
              <div
                style={{
                  fontSize: 38,
                  marginBottom: 10,
                  color: "#3b82f6",
                  filter: "drop-shadow(0 2px 8px #3b82f6aa)",
                }}
              >
                🏆
              </div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "2.1rem",
                  marginBottom: 2,
                }}
              >
                {stats.leagues_joined}
              </div>
              <div
                style={{
                  color: "#bfc4d1",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  letterSpacing: "0.01em",
                }}
              >
                Leagues Joined
              </div>
            </div>
            {/* Total Points */}
            <div
              style={{
                flex: 1,
                minWidth: 220,
                maxWidth: 320,
                background:
                  "linear-gradient(135deg, #23232b 60%, #06b6d4 120%)",
                borderRadius: 22,
                boxShadow: "0 4px 32px #0007",
                padding: "2.1rem 1.5rem 1.5rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                border: "1.5px solid #2a2a36",
                backdropFilter: "blur(2.5px)",
                marginBottom: 0,
              }}
            >
              <div
                style={{
                  fontSize: 38,
                  marginBottom: 10,
                  color: "#06b6d4",
                  filter: "drop-shadow(0 2px 8px #06b6d4aa)",
                }}
              >
                ⭐
              </div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "2.1rem",
                  marginBottom: 2,
                }}
              >
                {stats.total_points}
              </div>
              <div
                style={{
                  color: "#bfc4d1",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  letterSpacing: "0.01em",
                }}
              >
                Total Points
              </div>
            </div>
            {/* Rank */}
            <div
              style={{
                flex: 1,
                minWidth: 220,
                maxWidth: 320,
                background:
                  "linear-gradient(135deg, #23232b 60%, #f59e42 120%)",
                borderRadius: 22,
                boxShadow: "0 4px 32px #0007",
                padding: "2.1rem 1.5rem 1.5rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                border: "1.5px solid #2a2a36",
                backdropFilter: "blur(2.5px)",
                marginBottom: 0,
              }}
            >
              <div
                style={{
                  fontSize: 38,
                  marginBottom: 10,
                  color: "#f59e42",
                  filter: "drop-shadow(0 2px 8px #f59e42aa)",
                }}
              >
                🥇
              </div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "2.1rem",
                  marginBottom: 2,
                }}
              >
                {stats.rank}
              </div>
              <div
                style={{
                  color: "#bfc4d1",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  letterSpacing: "0.01em",
                }}
              >
                Rank
              </div>
            </div>
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
