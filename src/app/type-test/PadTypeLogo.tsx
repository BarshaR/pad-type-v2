import React from "react";

export const PadTypeLogo: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-1 w-full">
    <span
      className="text-2xl font-extrabold tracking-tight"
      style={{
        fontFamily: "Geist Mono, monospace",
        color: "#00ff99",
        textShadow: "0 0 8px #00ff99, 0 0 2px #fff",
        background: "#181818",
        borderRadius: "6px",
        display: "inline-block",
      }}
    >
      <span
        style={{
          color: "#fff",
          fontWeight: 900,
          fontFamily: "Geist Mono, monospace",
          textShadow: "0 0 2px #00ff99",
          paddingRight: "10px",
        }}
      >
        [
      </span>
      <span
        style={{
          color: "#00ff99",
          fontWeight: 900,
          fontFamily: "Geist Mono, monospace",
          textShadow: "0 0 2px #fff",
        }}
      >
        Pad
      </span>
      <span
        style={{
          color: "#fff",
          fontWeight: 900,
          fontFamily: "Geist Mono, monospace",
          textShadow: "0 0 2px #00ff99",
        }}
      >
        Type
      </span>
      <span
        style={{
          color: "#00ff99",
          fontWeight: 900,
          fontFamily: "Geist Mono, monospace",
          textShadow: "0 0 2px #fff",
          paddingLeft: "10px",
        }}
      >
        ]
      </span>
    </span>
  </div>
);
