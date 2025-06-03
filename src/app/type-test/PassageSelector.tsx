import React from "react";
import { Passage } from "./passages";

interface PassageSelectorProps {
  passages: Passage[];
  selectedPassage: string;
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  timerActive: boolean;
  onStop: () => void;
}

export const PassageSelector: React.FC<PassageSelectorProps> = ({
  passages,
  selectedPassage,
  onSelect,
  timerActive,
  onStop,
}) => (
  <div
    style={{
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}
  >
    <label htmlFor="passage-select" style={{ fontWeight: 500 }}>
      Choose passage:
    </label>
    <select
      id="passage-select"
      value={selectedPassage}
      onChange={onSelect}
      disabled={timerActive}
      style={{ padding: 6, fontSize: 16, borderRadius: 4 }}
    >
      {passages.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>
    {timerActive && (
      <button
        onClick={onStop}
        style={{
          marginLeft: 16,
          padding: "6px 18px",
          fontSize: 16,
          borderRadius: 4,
          background: "#c00",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Stop
      </button>
    )}
  </div>
);
