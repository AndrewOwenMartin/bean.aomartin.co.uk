import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { listReducer } from "../hooks/useList";
import { computeSlotPositions } from "../animation/geometry";
import { SwarmMotion, type SwarmAgentVisual } from "../animation/SwarmMotion";
import { AnimPanelShell } from "../animation/AnimPanelShell";
import { useAnimTimer } from "../animation/useAnimTimer";

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

const POLLING_STEPS = new Set<Step>([
  "pollAgent",
  "polledActivity",
  "diffuse",
]);

const AGENT_COUNT = 5;
const HYP_COUNT = 5;

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

interface DiffAnimMotionState {
  agents: Agent[];
  currentAgent: number;
  currentStep: Step;
  polledIndex: number;
}

type DiffAnimMotionAction = "STEP" | "RESET";

const makeInitialState = (agents: Agent[]): DiffAnimMotionState => ({
  agents,
  currentAgent: 0,
  currentStep: "checkActive",
  polledIndex: 0,
});

const noteBuilder = (state: DiffAnimMotionState): React.JSX.Element => {
  const agent = state.agents[state.currentAgent]!;
  const polled = state.agents[state.polledIndex]!;
  const agentNumber = state.currentAgent + 1;
  const polledNumber = state.polledIndex + 1;
  switch (state.currentStep) {
    case "nextAgent": {
      return (
        <span>Go to Agent {(agentNumber % state.agents.length) + 1}</span>
      );
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

const diffAnimMotionReducer = (
  state: DiffAnimMotionState,
  action: DiffAnimMotionAction,
): DiffAnimMotionState => {
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
    case "RESET":
      return makeInitialState(INIT_AGENTS);
  }
};

const useDiffAnimMotion = () => {
  const [state, dispatch] = React.useReducer(
    diffAnimMotionReducer,
    undefined,
    () => makeInitialState(INIT_AGENTS),
  );

  const step = React.useCallback(() => dispatch("STEP"), []);
  const timer = useAnimTimer(step, 1500);

  const reset = () => {
    timer.pause();
    dispatch("RESET");
  };

  const { agents, currentAgent, polledIndex, currentStep } = state;
  const positions = computeSlotPositions(
    agents.map((a) => a.hyp),
    HYP_COUNT,
  );
  const activeLine = STEP_LINE[currentStep];
  const showConnector = POLLING_STEPS.has(currentStep);

  const agentVisuals: SwarmAgentVisual[] = agents.map((agent, i) => ({
    fill: agent.active ? "#22c55e" : "#94a3b8",
    ringColor:
      i === currentAgent
        ? "#f59e0b"
        : i === polledIndex && showConnector
          ? "#fb923c"
          : undefined,
  }));

  const connector = {
    from: positions[currentAgent]!,
    to: positions[polledIndex]!,
    visible: showConnector,
  };

  const note = noteBuilder(state);

  return {
    isPlaying: timer.isPlaying,
    togglePlay: timer.togglePlay,
    step: timer.step,
    reset,
    positions,
    agentVisuals,
    connector,
    activeLine,
    note,
  };
};

const DiffAnimMotionView = (props: ReturnType<typeof useDiffAnimMotion>) => {
  const {
    isPlaying,
    togglePlay,
    step,
    reset,
    positions,
    agentVisuals,
    connector,
    activeLine,
    note,
  } = props;

  return (
    <AnimPanelShell
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      onStep={step}
      onReset={reset}
      code={
        <Highlight code={PYTHON_CODE} language="python" theme={themes.github}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                return (
                  <div
                    key={i}
                    {...lineProps}
                    className={[
                      lineProps.className,
                      i === activeLine ? "anim-active-line" : "",
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
      }
      swarm={
        <SwarmMotion
          positions={positions}
          agents={agentVisuals}
          slotCount={HYP_COUNT}
          connector={connector}
        />
      }
      notes={note}
    />
  );
};

export const DiffAnimMotion = () => (
  <DiffAnimMotionView {...useDiffAnimMotion()} />
);
