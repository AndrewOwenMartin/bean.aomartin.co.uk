import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import "./diff-anim.css";
import { listReducer } from "../hooks/useList";

interface Agent {
  active: boolean;
  hyp: number;
}

type Step =
  | "nextAgent"
  | "checkActive"
  | "pollAgent"
  | "polledActivity"
  | "diffuse"
  | "newHyp";

const STEP_LINE: Record<Step, number> = {
  nextAgent: 0,
  checkActive: 1,
  pollAgent: 2,
  polledActivity: 3,
  diffuse: 4,
  newHyp: 6,
};

const randomInt = (count: number) => Math.floor(Math.random() * count);

const POLLING_STEPS = new Set<Step>(["pollAgent", "polledActivity", "diffuse"]);

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

const INIT_AGENTS: Agent[] = Array(AGENT_COUNT)
  .fill(null)
  .map((_, index) => ({ active: index >= 3, hyp: index }));

const initAgents = (agents?: Agent[]): Agent[] => {
  if (agents) {
    return [...agents];
  }
  return Array.from({ length: AGENT_COUNT }, () => ({
    active: Math.random() > 0.5,
    hyp: randomInt(HYP_COUNT),
  }));
};

interface DiffAnimState {
  agents: Agent[];
  currentAgent: number;
  currentStep: Step;
  polledIndex: number;
  isPlaying: boolean;
}

type DiffAnimAction = "STEP" | "TOGGLE_PLAY" | "RESET";

const makeInitialState = (agents?: Agent[]): DiffAnimState => ({
  agents: agents || initAgents(),
  currentAgent: 0,
  currentStep: "checkActive",
  polledIndex: 0,
  isPlaying: true,
});

const noteBuilder = (state: DiffAnimState): React.JSX.Element => {
  const agent = state.agents[state.currentAgent];
  const polled = state.agents[state.polledIndex];
  const agentNumber = state.currentAgent + 1;
  const polledNumber = (state.polledIndex || 0) + 1;
  switch (state.currentStep) {
    case "nextAgent": {
      return <span>Go to Agent {(agentNumber % state.agents.length) + 1}</span>;
    }
    case "checkActive": {
      return (
        <div>
          <div>
            Agent {agentNumber} is {agent.active ? "active" : "inactive"}
          </div>
          <div>{agent.active ? "Do nothing" : "Select an agent at random"}</div>
        </div>
      );
    }
    case "pollAgent": {
      return (
        <div>
          <div>
            Agent {agentNumber} polls agent {polledNumber}
          </div>
          <div>
            {polled.active ? `Active: Yes. Hyp: ${polled.hyp}` : "Active: No"}
          </div>
        </div>
      );
    }
    case "polledActivity": {
      return (
        <div>
          <div>Polled agent is {polled.active ? "active" : "inactive"}</div>
          {polled.active ? (
            <div>Copy hypothesis</div>
          ) : (
            <div>Make new hypothesis</div>
          )}
        </div>
      );
    }
    case "diffuse": {
      return (
        <div>
          Agent {agentNumber} copies the hypothesis of polled agent{" "}
          {polledNumber}
        </div>
      );
    }
    case "newHyp": {
      return (
        <div>
          Agent {agentNumber} moves to random hypothesis {agent.hyp + 1}
        </div>
      );
    }
  }
};

const diffAnimReducer = (
  state: DiffAnimState,
  action: DiffAnimAction,
): DiffAnimState => {
  switch (action) {
    case "STEP": {
      const { currentStep, currentAgent, agents, polledIndex } = state;
      const agent = agents[currentAgent]!;
      const polledAgent = agents[polledIndex]!;
      if (currentStep === "nextAgent") {
        return {
          ...state,
          currentStep: "checkActive",
          currentAgent: (currentAgent + 1) % AGENT_COUNT,
        };
      }
      if (currentStep === "checkActive") {
        if (agent.active) return { ...state, currentStep: "nextAgent" };
        return {
          ...state,
          currentStep: "pollAgent",
          polledIndex: randomInt(AGENT_COUNT),
        };
      }
      if (currentStep === "pollAgent") {
        return { ...state, currentStep: "polledActivity" };
      }
      if (currentStep === "polledActivity") {
        if (polledAgent.active) {
          return {
            ...state,
            currentStep: "diffuse",
            agents: listReducer(agents, {
              type: "replaceItem",
              index: currentAgent,
              newValue: { ...agent, hyp: polledAgent.hyp },
            }),
          };
        }
        return {
          ...state,
          currentStep: "newHyp",
          agents: listReducer(agents, {
            type: "replaceItem",
            index: currentAgent,
            newValue: { ...agent, hyp: randomInt(HYP_COUNT) },
          }),
        };
      }
      if (currentStep === "diffuse" || currentStep === "newHyp") {
        return { ...state, currentStep: "nextAgent" };
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
  agents.forEach(
    (a, i) =>
      (stacks[a.hyp] = listReducer(stacks[a.hyp], {
        type: "set",
        newList: [i, ...stacks[a.hyp]],
      })),
  );
  return agents.map((a, i) => ({
    x: SLOT_X[a.hyp]!,
    y: BASELINE_Y - R - stacks[a.hyp]!.indexOf(i) * STACK_GAP,
  }));
};

const useDiffAnim = () => {
  const [state, dispatch] = React.useReducer(diffAnimReducer, undefined, () =>
    makeInitialState(INIT_AGENTS),
  );
  const timerRef = React.useRef<ReturnType<typeof setInterval>>(undefined);

  const step = React.useCallback(() => dispatch("STEP"), []);

  React.useEffect(() => {
    if (state.isPlaying) {
      timerRef.current = setInterval(step, 1500);
    }
    return () => clearInterval(timerRef.current);
  }, [step, state.isPlaying]);

  const togglePlay = () => dispatch("TOGGLE_PLAY");
  const reset = () => {
    clearInterval(timerRef.current);
    dispatch("RESET");
  };

  const { agents, currentAgent, polledIndex, isPlaying, currentStep } = state;
  const positions = computePositions(agents);
  const activeLine = STEP_LINE[currentStep];
  const showConnector = POLLING_STEPS.has(currentStep);

  const note = noteBuilder(state);

  return {
    agents,
    currentAgent,
    polledIndex,
    isPlaying,
    positions,
    activeLine,
    showConnector,
    togglePlay,
    step,
    reset,
    note,
  };
};

const DiffAnimView = (props: ReturnType<typeof useDiffAnim>) => {
  const {
    agents,
    currentAgent,
    polledIndex,
    isPlaying,
    positions,
    activeLine,
    showConnector,
    togglePlay,
    step,
    reset,
    note,
  } = props;
  const curPos = positions[currentAgent]!;
  const pollPos = positions[polledIndex]!;

  return (
    <div className="diff-anim">
      <div className="diff-anim-controls">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={step}>Step</button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className="diff-anim">
        <div className="diff-anim-panels">
          <div className="diff-anim-code">
            <Highlight
              code={PYTHON_CODE}
              language="python"
              theme={themes.github}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                  {tokens.map((line, i) => {
                    const lp = getLineProps({ line });
                    return (
                      <div
                        key={i}
                        {...lp}
                        className={[
                          lp.className,
                          i === activeLine ? "diff-anim-active-line" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
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
                <g
                  key={i}
                  className="diff-anim-agent"
                  style={{
                    transform: `translate(${positions[i]!.x}px, ${positions[i]!.y}px)`,
                  }}
                >
                  <circle
                    cx={0}
                    cy={0}
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
                </g>
              ))}
            </svg>
          </div>
          <div className="diff-anim-notes">{note}</div>
        </div>
      </div>
    </div>
  );
};

export const DiffAnim = () => <DiffAnimView {...useDiffAnim()} />;
