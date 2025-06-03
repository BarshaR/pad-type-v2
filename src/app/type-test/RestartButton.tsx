import React from "react";

interface RestartButtonProps {
  onRestart: () => void;
  isComplete: boolean;
}

export const RestartButton: React.FC<RestartButtonProps> = ({
  onRestart,
  isComplete,
}) => (
  <button
    onClick={onRestart}
    disabled={!isComplete}
    style={{
      position: "fixed",
      bottom: 32,
      right: 32,
      padding: "14px 32px",
      fontSize: 20,
      borderRadius: 8,
      background: "#222",
      color: "#fff",
      border: "none",
      cursor: isComplete ? "pointer" : "not-allowed",
      opacity: isComplete ? 1 : 0.5,
      zIndex: 1000,
    }}
  >
    Restart Test
  </button>
);
