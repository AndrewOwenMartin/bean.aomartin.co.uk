import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import "./diff-anim.css";

interface Agent {
  active: boolean;
  hyp: number;
}

type Step = "nextAgent" | "checkActive" | "pollAgent" | "polledActivity" | "diffuse" | "newHyp";

const STEP_LINE: Record<Step, number> = {
  'nextAgent': 0,
  'checkActive': 1,
  'pollAgent' : 2,
  'polledActivity': 3,
  'diffuse': 4,
  'newHyp': 6,
};

const POLLING_STEPS = new Set<Step>(['pollAgent', 'polledActivity', 'diffuse']);

const AGENT_COUNT = 5;
const HYP_COUNT = 5;
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

const randomInt = (count: number) => Math.floor(Math.random() * count);

const initAgents = (): Agent[] =>
  Array.from({ length: AGENT_COUNT }, () => ({
    active: Math.random() > 0.5,
    hyp: randomInt(HYP_COUNT),
  }));

const replaceAt = <T,>(arr: T[], i: number, v: T): T[] => [
  ...arr.slice(0, i),
  v,
  ...arr.slice(i + 1),
];

interface DiffAnimState {
  agents: Agent[];
  currentAgent: number;
  currentStep: Step;
  polledIndex: number;
  isPlaying: boolean;
}

type DiffAnimAction =
  | { type: "STEP" }
  | { type: "TOGGLE_PLAY" }
  | { type: "RESET" };

const makeInitialState = (): DiffAnimState => ({
  agents: initAgents(),
  currentAgent: 0,
  currentStep: 'checkActive',
  polledIndex: 0,
  isPlaying: true,
});

const diffAnimReducer = (state: DiffAnimState, action: DiffAnimAction): DiffAnimState => {
  switch (action.type) {
    case "STEP": {
      const { currentStep, currentAgent, agents, polledIndex } = state;
      const agent = agents[currentAgent]!;
      const polledAgent = agents[polledIndex]!;
      if (currentStep === 'nextAgent') {
        return { ...state, currentStep: 'checkActive', currentAgent: (currentAgent + 1) % AGENT_COUNT };
      }
      if (currentStep === 'checkActive') {
        if (agent.active) return { ...state, currentStep: 'nextAgent' };
        return { ...state, currentStep: 'pollAgent', polledIndex: randomInt(AGENT_COUNT) };
      }
      if (currentStep === 'pollAgent') {
        return { ...state, currentStep: 'polledActivity' };
      }
      if (currentStep === 'polledActivity') {
        if (polledAgent.active) {
          return {
            ...state,
            currentStep: 'diffuse',
            agents: replaceAt(agents, currentAgent, { ...agent, hyp: polledAgent.hyp }),
          };
        }
        return {
          ...state,
          currentStep: 'newHyp',
          agents: replaceAt(agents, currentAgent, { ...agent, hyp: randomInt(HYP_COUNT) }),
        };
      }
      if (currentStep === 'diffuse' || currentStep === 'newHyp') {
        return { ...state, currentStep: 'nextAgent' };
      }
      return state;
    }
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "RESET":
      return { ...makeInitialState(), isPlaying: false };
  }
};

interface AgentPos {
  x: number;
  y: number;
}

const computePositions = (agents: Agent[]): AgentPos[] => {
  const stacks: number[][] = Array.from({ length: HYP_COUNT }, () => []);
  agents.forEach((a, i) => stacks[a.hyp]!.push(i));
  return agents.map((a, i) => ({
    x: SLOT_X[a.hyp]!,
    y: BASELINE_Y - R - stacks[a.hyp]!.indexOf(i) * STACK_GAP,
  }));
};

const useDiffAnim = () => {
  const [state, dispatch] = React.useReducer(diffAnimReducer, undefined, makeInitialState);
  const timerRef = React.useRef<ReturnType<typeof setInterval>>(undefined);

  const step = React.useCallback(() => dispatch({ type: "STEP" }), []);

  React.useEffect(() => {
    if (state.isPlaying) {
      timerRef.current = setInterval(step, 800);
    }
    return () => clearInterval(timerRef.current);
  }, [step, state.isPlaying]);

  const togglePlay = () => dispatch({ type: "TOGGLE_PLAY" });
  const reset = () => {
    clearInterval(timerRef.current);
    dispatch({ type: "RESET" });
  };

  const { agents, currentAgent, polledIndex, isPlaying, currentStep } = state;
  const positions = computePositions(agents);
  const activeLine = STEP_LINE[currentStep];
  const showConnector = POLLING_STEPS.has(currentStep);

  return { agents, currentAgent, polledIndex, isPlaying, positions, activeLine, showConnector, togglePlay, step, reset };
};

const DiffAnimView = (props: ReturnType<typeof useDiffAnim>) => {
  const { agents, currentAgent, polledIndex, isPlaying, positions, activeLine, showConnector, togglePlay, step, reset } = props;
  const curPos = positions[currentAgent]!;
  const pollPos = positions[polledIndex]!;

  return (
    <div className="diff-anim">
      <div className="diff-anim-controls">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
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
                      className={[lp.className, i === activeLine ? "diff-anim-active-line" : ""].filter(Boolean).join(" ")}
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
          <svg className="diff-anim-svg" width={SVG_W} height={SVG_H}>
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
              className={`diff-anim-connector${showConnector ? " visible" : ""}`}
              x1={curPos.x}
              y1={curPos.y}
              x2={pollPos.x}
              y2={pollPos.y}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 3"
            />
            {agents.map((agent, i) => (
              <circle
                key={i}
                className="diff-anim-agent"
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
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export const DiffAnim = () => <DiffAnimView {...useDiffAnim()} />;
