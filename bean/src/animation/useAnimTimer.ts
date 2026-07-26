import React from "react";
import { useBoolean } from "../hooks/useBoolean";

export interface AnimTimer {
  isPlaying: boolean;
  togglePlay: () => void;
  pause: () => void;
  step: () => void;
}

export const useAnimTimer = (
  onStep: () => void,
  intervalMs = 1500,
): AnimTimer => {
  const playing = useBoolean(true);
  const timerRef = React.useRef<ReturnType<typeof setInterval>>(undefined);

  React.useEffect(() => {
    if (playing.value) {
      timerRef.current = setInterval(onStep, intervalMs);
    }
    return () => clearInterval(timerRef.current);
  }, [onStep, intervalMs, playing.value]);

  return {
    isPlaying: playing.value,
    togglePlay: playing.toggle,
    pause: playing.off,
    step: onStep,
  };
};
