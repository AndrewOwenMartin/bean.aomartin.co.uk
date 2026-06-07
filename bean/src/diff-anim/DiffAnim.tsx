import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import "./diff-anim.css";

interface Agent {
  active: boolean;
  hyp: number;
}

const AGENT_COUNT = 5;
const HYP_COUNT = 5;
const STEPS = ["nextAgent", "checkActive", "pollAgent", "polledActivity", "diffuse", "newHyp"];
const STEP_LINE: Record<string, number> = {
  nextAgent: 0,
  checkActive: 1,
  pollAgent: 2,
  polledActivity: 3,
  diffuse: 4,
  newHyp: 6,
};
const POLLING_STEPS = new Set(["pollAgent", "polledActivity", "diffuse", "newHyp"]);

const SVG_W = 400;
const SVG_H = 200;
const PAD = 40;
const BASELINE_Y = 155;
const R = 12;
const STACK_GAP = 28;
const SLOT_X = Array.from(
  { length: HYP_COUNT },
  (_, i) => PAD + (i * (SVG_W - 2 * PAD)) / (HYP_COUNT - 1),
);

const PYTHON_CODE = `for agent in agents:
    if not agent.active:
        polled = random.choice(agents)
        if polled.active:
            agent.hyp = polled.hyp
        else:
            agent.hyp = random.choice(hypotheses)`;

const ri = (n: number) => Math.floor(Math.random() * n);

const initAgents = (): Agent[] =>
  Array.from({ length: AGENT_COUNT }, () => ({
    active: Math.random() > 0.5,
    hyp: ri(HYP_COUNT),
  }));

const replaceAt = <T,>(arr: T[], i: number, v: T): T[] => [
  ...arr.slice(0, i),
  v,
  ...arr.slice(i + 1),
];

function useDiffAnim() {
  const [agents, setAgents] = React.useState<Agent[]>(initAgents);
  const [currentAgent, setCurrentAgent] = React.useState(0);
  const [stepIdx, setStepIdx] = React.useState(1);
  const [polledIndex, setPolledIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const timerRef = React.useRef<ReturnType<typeof setInterval>>(undefined);

  const currentStep = STEPS[stepIdx]!;
  const agent = agents[currentAgent]!;
  const polledAgent = agents[polledIndex]!;

  const step = React.useCallback(() => {
    let next = currentStep;
    if (currentStep === "nextAgent") {
      next = "checkActive";
    } else if (currentStep === "checkActive") {
      if (agent.active) {
        next = "nextAgent";
      } else {
        next = "pollAgent";
        setPolledIndex(ri(AGENT_COUNT));
      }
    } else if (currentStep === "pollAgent") {
      next = "polledActivity";
    } else if (currentStep === "polledActivity") {
      const updated = { ...agent };
      if (polledAgent.active) {
        updated.hyp = polledAgent.hyp;
        next = "diffuse";
      } else {
        updated.hyp = ri(HYP_COUNT);
        next = "newHyp";
      }
      setAgents((prev) => replaceAt(prev, currentAgent, updated));
    } else if (currentStep === "diffuse" || currentStep === "newHyp") {
      next = "nextAgent";
    }
    setStepIdx(STEPS.indexOf(next));
    if (currentStep === "nextAgent") {
      setCurrentAgent((ca) => (ca + 1) % AGENT_COUNT);
    }
  }, [currentStep, agent, polledAgent, currentAgent]);

  React.useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(step, 800);
    }
    return () => clearInterval(timerRef.current);
  }, [step, isPlaying]);

  const reset = () => {
    clearInterval(timerRef.current);
    setAgents(initAgents());
    setCurrentAgent(0);
    setStepIdx(1);
    setPolledIndex(0);
    setIsPlaying(false);
  };

  return { agents, currentAgent, currentStep, polledIndex, isPlaying, setIsPlaying, step, reset };
}

interface AgentPos {
  x: number;
  y: number;
}

function computePositions(agents: Agent[]): AgentPos[] {
  const stacks: number[][] = Array.from({ length: HYP_COUNT }, () => []);
  agents.forEach((a, i) => stacks[a.hyp]!.push(i));
  return agents.map((a, i) => ({
    x: SLOT_X[a.hyp]!,
    y: BASELINE_Y - R - stacks[a.hyp]!.indexOf(i) * STACK_GAP,
  }));
}

export const DiffAnim = () => {
  const { agents, currentAgent, currentStep, polledIndex, isPlaying, setIsPlaying, step, reset } =
    useDiffAnim();
  const positions = computePositions(agents);
  const activeLine = STEP_LINE[currentStep]!;
  const showConnector = POLLING_STEPS.has(currentStep);

  const curPos = positions[currentAgent]!;
  const pollPos = positions[polledIndex]!;

  return (
    <div className="diff-anim">
      <div className="diff-anim-controls">
        <button onClick={() => setIsPlaying((p) => !p)}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={step}>Step</button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className="diff-anim-panels">
        <div className="diff-anim-code">
          <Highlight code={PYTHON_CODE} language="python" theme={themes.github}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} style={style}>
                {tokens.map((line, i) => {
                  const lp = getLineProps({ line });
                  return (
                    <div
                      key={i}
                      {...lp}
                      style={{
                        ...lp.style,
                        ...(i === activeLine ? { background: "#fef9c3" } : {}),
                      }}
                    >
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>
        <div className="diff-anim-swarm">
          <svg width={SVG_W} height={SVG_H} style={{ display: "block" }}>
            <line
              x1={PAD - 10}
              y1={BASELINE_Y}
              x2={SVG_W - PAD + 10}
              y2={BASELINE_Y}
              stroke="#ccc"
              strokeWidth={2}
            />
            {SLOT_X.map((x, i) => (
              <g key={i}>
                <line x1={x} y1={BASELINE_Y} x2={x} y2={BASELINE_Y + 6} stroke="#ccc" strokeWidth={1.5} />
                <text x={x} y={BASELINE_Y + 18} textAnchor="middle" fontSize={11} fill="#999">
                  {i + 1}
                </text>
              </g>
            ))}
            <line
              x1={curPos.x}
              y1={curPos.y}
              x2={pollPos.x}
              y2={pollPos.y}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 3"
              style={{ opacity: showConnector ? 1 : 0, transition: "opacity 0.2s ease, x1 0.35s ease, y1 0.35s ease, x2 0.35s ease, y2 0.35s ease" }}
            />
            {agents.map((agent, i) => (
              <circle
                key={i}
                cx={positions[i]!.x}
                cy={positions[i]!.y}
                r={R}
                fill={agent.active ? "#22c55e" : "#94a3b8"}
                stroke={
                  i === currentAgent
                    ? "#f59e0b"
                    : i === polledIndex && showConnector
                      ? "#fb923c"
                      : "none"
                }
                strokeWidth={3}
                style={{ transition: "cx 0.35s ease, cy 0.35s ease" }}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
