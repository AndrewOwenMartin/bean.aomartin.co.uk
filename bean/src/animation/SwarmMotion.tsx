import { motion } from "motion/react";
import { SVG_W, SVG_H, PAD, BASELINE_Y, R, slotX, type SlotPos } from "./geometry";
import "./animation.css";

export interface SwarmAgentVisual {
  fill: string;
  ringColor?: string;
}

export interface SwarmConnector {
  from: SlotPos;
  to: SlotPos;
  visible: boolean;
}

export interface SwarmMotionProps {
  positions: SlotPos[];
  agents: SwarmAgentVisual[];
  slotCount: number;
  connector?: SwarmConnector;
}

export const SwarmMotion = ({
  positions,
  agents,
  slotCount,
  connector,
}: SwarmMotionProps) => {
  const xs = slotX(slotCount);

  return (
    <svg className="anim-svg" width={SVG_W} height={SVG_H}>
      <line
        x1={PAD - 10}
        y1={BASELINE_Y}
        x2={SVG_W - PAD + 10}
        y2={BASELINE_Y}
        stroke="#ccc"
        strokeWidth={2}
      />
      {xs.map((x, i) => (
        <g key={i}>
          <line
            x1={x}
            y1={BASELINE_Y}
            x2={x}
            y2={BASELINE_Y + 6}
            stroke="#ccc"
            strokeWidth={1.5}
          />
          <text
            x={x}
            y={BASELINE_Y + 18}
            textAnchor="middle"
            fontSize={11}
            fill="#999"
          >
            {i + 1}
          </text>
        </g>
      ))}
      {connector && (
        <motion.line
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 3"
          initial={false}
          animate={{
            x1: connector.from.x,
            y1: connector.from.y,
            x2: connector.to.x,
            y2: connector.to.y,
            opacity: connector.visible ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      )}
      {agents.map((agent, i) => (
        <motion.g
          key={i}
          initial={false}
          animate={{ x: positions[i]!.x, y: positions[i]!.y }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.circle
            cx={0}
            cy={0}
            r={R}
            strokeWidth={3}
            initial={false}
            animate={{
              fill: agent.fill,
              stroke: agent.ringColor ?? "transparent",
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          />
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fill="#fff"
            style={{ userSelect: "none" }}
          >
            {i + 1}
          </text>
        </motion.g>
      ))}
    </svg>
  );
};
