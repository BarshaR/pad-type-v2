import React from "react";
import { Passage } from "./passages";

interface ControlsBarProps {
  passages: Passage[];
  selectedPassage: string;
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  timerActive: boolean;
  onStop: () => void;
  onRestart: () => void;
  isComplete: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  passages,
  selectedPassage,
  onSelect,
  timerActive,
  onStop,
  onRestart,
  isComplete,
}) => (
  <div
    className="controls-bar"
    style={{
      marginBottom: 24,
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
    <button
      onClick={onRestart}
      disabled={!isComplete}
      style={{
        marginLeft: 16,
        padding: "6px 18px",
        fontSize: 16,
        borderRadius: 4,
        background: "#222",
        color: "#fff",
        border: "none",
        cursor: isComplete ? "pointer" : "not-allowed",
        opacity: isComplete ? 1 : 0.5,
      }}
    >
      Restart Test
    </button>
  </div>
);
