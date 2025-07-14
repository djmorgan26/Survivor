import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import loveIslandFrame from "../assets/love_island_frame.jpg";

export default function LoveIslandPage() {
  const { user, token, logout } = useAuth();
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
          Love Island Central
        </h1>
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
              color: "#f472b6",
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
              border: "1px dashed #f472b6",
              borderRadius: 12,
              padding: 18,
              background: "#15151a",
              marginBottom: 18,
            }}
          >
            {/* TODO: Replace with live news/updates */}
            <span>Stay tuned for the latest Love Island news and updates!</span>
          </div>
        </section>
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
              color: "#f472b6",
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
              src={loveIslandFrame}
              alt="Love Island Featured Graphic"
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
                color: "#f472b6",
                fontWeight: 700,
                fontSize: 18,
                boxShadow: "0 2px 8px #0006",
              }}
            >
              Love Island Logo
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
                color: "#f472b6",
                fontWeight: 700,
                fontSize: 18,
                boxShadow: "0 2px 8px #0006",
              }}
            >
              Villa Photo
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
                color: "#f472b6",
                fontWeight: 700,
                fontSize: 18,
                boxShadow: "0 2px 8px #0006",
              }}
            >
              Couple Chart
            </div>
          </div>
        </section>
        {/* Add more Love Island-specific sections here */}
      </main>
    </div>
  );
}
