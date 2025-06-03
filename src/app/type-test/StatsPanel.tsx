import React from "react";

interface StatsPanelProps {
  mistakeCount: number;
  timer: number;
  wpm: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  mistakeCount,
  timer,
  wpm,
}) => (
  <div
    style={{
      width: "100%",
      maxWidth: 200,
      marginLeft: 0,
      padding: 20,
      color: "#fff",
      textAlign: "center",
      borderRadius: 5,
      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)",
      height: "fit-content",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      border: "1.5px solid #2c2c2e",
      fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
      boxSizing: "border-box",
    }}
  >
    <h3
      style={{
        margin: 0,
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: 1,
        color: "#a0e9a3",
      }}
    >
      Stats
    </h3>
    <div
      style={{
        width: "100%",
        height: 1,
        background: "#333",
        margin: "16px 0 20px 0",
      }}
    />
    <div style={{ width: "100%", marginBottom: 18 }}>
      <div style={{ fontSize: 15, color: "#bdbdbd", marginBottom: 2 }}>
        Mistakes
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 700,
          color: mistakeCount > 0 ? "#ff5e5e" : "#4be04b",
          textShadow:
            mistakeCount > 0 ? "0 2px 8px #ff5e5e33" : "0 2px 8px #4be04b33",
          letterSpacing: 1,
        }}
      >
        {mistakeCount}
      </div>
    </div>
    <div style={{ width: "100%", marginBottom: 18 }}>
      <div style={{ fontSize: 15, color: "#bdbdbd", marginBottom: 2 }}>
        Timer
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 700,
          color: "#f7c873",
          textShadow: "0 2px 8px #f7c87333",
          letterSpacing: 1,
        }}
      >
        {timer}s
      </div>
    </div>
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: 15, color: "#bdbdbd", marginBottom: 2 }}>WPM</div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 700,
          color: "#6ecbfa",
          textShadow: "0 2px 8px #6ecbfa33",
          letterSpacing: 1,
        }}
      >
        {wpm}
      </div>
    </div>
    <style>{`
      @media (max-width: 600px) {
        .type-test-stats-panel {
          max-width: 100vw !important;
          margin-left: 0 !important;
          margin-top: 16px !important;
          border-radius: 0 0 16px 16px !important;
          box-shadow: none !important;
          padding: 12px !important;
        }
        .type-test-stats-panel h3 {
          font-size: 18px !important;
        }
      }
    `}</style>
  </div>
);
