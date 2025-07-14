export default function TransitionSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#101014",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
            boxShadow: "0 0 32px 8px #2563eb55, 0 0 0 8px #23232b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse-strong 1s cubic-bezier(.4,0,.6,1) infinite",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#fff",
              opacity: 0.12,
            }}
          />
        </div>
        <div
          style={{
            width: 260,
            height: 28,
            borderRadius: 8,
            background: "#23232b",
            marginBottom: 12,
            animation: "pulse 1.2s infinite alternate",
          }}
        />
        <div
          style={{
            width: 180,
            height: 18,
            borderRadius: 8,
            background: "#23232b",
            animation: "pulse 1.2s infinite alternate",
          }}
        />
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.7; filter: blur(0px); }
            100% { opacity: 1; filter: blur(2px); }
          }
          @keyframes pulse-strong {
            0% { box-shadow: 0 0 32px 8px #2563eb55, 0 0 0 8px #23232b; opacity: 1; }
            50% { box-shadow: 0 0 64px 24px #2563ebcc, 0 0 0 16px #23232b; opacity: 0.7; }
            100% { box-shadow: 0 0 32px 8px #2563eb55, 0 0 0 8px #23232b; opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
