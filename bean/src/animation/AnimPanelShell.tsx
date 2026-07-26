import type React from "react";
import "./animation.css";

export interface AnimPanelShellProps {
  code: React.JSX.Element;
  swarm: React.JSX.Element;
  notes: React.JSX.Element;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
}

export const AnimPanelShell = ({
  code,
  swarm,
  notes,
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
}: AnimPanelShellProps) => (
  <div className="anim-shell">
    <div className="anim-controls">
      <button onClick={onTogglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={onStep}>Step</button>
      <button onClick={onReset}>Reset</button>
    </div>
    <div className="anim-panels">
      <div className="anim-code">{code}</div>
      <div className="anim-swarm">{swarm}</div>
      <div className="anim-notes">{notes}</div>
    </div>
  </div>
);
