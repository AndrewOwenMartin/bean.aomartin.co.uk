import React from "react";
import "./diff-anim.css";

interface Agent {
  active: boolean;
  hyp: number;
}

interface Hyp {
  score: number;
}

const initAgent = () => {
  return {
    active: false,
    hyp: undefined,
  };
};

const randomInt = (n: number) => Math.floor(Math.random() * n);

const randomHyp = (hypCount) => randomInt(hypCount);

const randomAgent = (hypCount) => {
  return {
    active: Math.random() > 0.5,
    hyp: randomHyp(hypCount),
  };
};

const steps = [
  "nextAgent",
  "checkActive",
  "pollAgent",
  "polledActivity",
  "diffuse",
  "newHyp",
];
type Step = (typeof steps)[number];

const replaceItemInList = (list, index, newItem) => {
  return [...list.slice(0, index), newItem, ...list.slice(index + 1)];
};

const initAgents = (agentCount, hypCount) => {
  return Array(agentCount)
    .fill()
    .map(() => randomAgent(hypCount));
};

const useDiffAnim = ({ agentCount, hypCount }) => {
  const [agents, setAgents] = React.useState(initAgents(agentCount, hypCount));

  const [currentAgent, setCurrentAgent] = React.useState(0);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(1);
  const currentStep = steps[currentStepIndex];
  const agent = agents[currentAgent];
  const [polledIndex, setPolledIndex] = React.useState(0);
  const polledAgent = agents[polledIndex];
  const pollingStates = ["pollAgent", "polledActivity", "diffuse"];
  const isPollingState = pollingStates.includes(currentStep);
  const newHyp = () => randomHyp(hypCount);
  const timer = React.useRef(undefined);
  const [isAutoStep, setIsAutoStep] = React.useState(false);

  const step = () => {
    let nextStep;
    if (currentStep === "nextAgent") {
      nextStep = "checkActive";
    } else if (currentStep === "checkActive") {
      if (agent.active) {
        nextStep = "nextAgent";
      } else {
        nextStep = "pollAgent";
        const randInt = randomInt(agentCount);
        setPolledIndex(randInt);
      }
    } else if (currentStep === "pollAgent") {
      nextStep = "polledActivity";
    } else if (currentStep === "polledActivity") {
      const newAgent = { ...agent };
      if (polledAgent.active) {
        newAgent.hyp = polledAgent.hyp;
        nextStep = "diffuse";
      } else {
        newAgent.hyp = newHyp();
        nextStep = "newHyp";
      }
      const replaceAgent = (agents) =>
        replaceItemInList(agents, currentAgent, newAgent);
      setAgents(replaceAgent);
    } else if (currentStep === "diffuse") {
      nextStep = "nextAgent";
    } else if (currentStep === "newHyp") {
      nextStep = "nextAgent";
    }
    const nextStepIndex = steps.indexOf(nextStep);
    setCurrentStepIndex(nextStepIndex);
    if (currentStep === "nextAgent") {
      setCurrentAgent((prevAgent) => (prevAgent + 1) % agents.length);
    }
  };

  React.useEffect(() => {
    if (isAutoStep) {
      timer.current = setInterval(step, 1000);
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [step, isAutoStep]);

  const reset = () => {
    setCurrentAgent(0);
    setCurrentStepIndex(1);
    setAgents(initAgents(agentCount, hypCount));
    setIsAutoStep(false);
    clearInterval(timer.current);
  };

  return {
    agents,
    currentAgent,
    currentStep,
    currentStepIndex,
    step,
    polledIndex,
    polledAgent,
    isPollingState,
    reset,
    isAutoStep,
    setIsAutoStep,
  };
};

const Agent = (props: Agent) => {
  return (
    <div>
      Active: {props.active ? "Yes" : "No"}.
      <span> Hyp: {props.hyp !== undefined ? props.hyp : "None"}</span>
    </div>
  );
};

const ExplainBox = (props) => {
  const agentNumber = props.agentIndex + 1;
  const polledNumber = props.polledIndex + 1;
  const agent = props.agents[props.agentIndex];
  const polled = props.polledAgent;
  return (
    <div className="explain-box">
      {props.currentStep === "nextAgent" && (
        <div>
          Go to Agent {((props.agentIndex + 1) % props.agents.length) + 1}
        </div>
      )}
      {props.currentStep === "checkActive" && (
        <div>
          <div>
            Agent {agentNumber} is {agent.active ? "active" : "inactive"}
          </div>
          <div>{agent.active ? "Do nothing" : "Select an agent at random"}</div>
        </div>
      )}
      {props.currentStep === "pollAgent" && (
        <div>
          <div>
            Agent {agentNumber} polls agent {polledNumber}
          </div>
          <div>
            {polled.active ? `Active: Yes. Hyp: ${polled.hyp}` : "Active: No"}
          </div>
        </div>
      )}
      {props.currentStep === "polledActivity" && (
        <div>
          <div>Polled agent is {polled.active ? "active" : "inactive"}</div>
          {polled.active ? (
            <div>Copy hypothesis</div>
          ) : (
            <div>Make new hypothesis</div>
          )}
        </div>
      )}
      {props.currentStep === "diffuse" && (
        <div>
          Agent {agentNumber} copies the hypothesis of polled agent{" "}
          {polledNumber}
        </div>
      )}
      {props.currentStep === "newHyp" && (
        <div>
          Agent {agentNumber} creates new hypothesis '{agent.hyp}'
        </div>
      )}
    </div>
  );
};

export const DiffAnim = () => {
  const state = useDiffAnim({ agentCount: 10, hypCount: 10 });

  return (
    <>
      <div>
        <button onClick={state.step}>Step</button>
        <button onClick={state.reset}>Reset</button>
        <button
          disabled={state.isAutoStep}
          onClick={() => state.setIsAutoStep(true)}
        >
          Auto
        </button>
        <button
          disabled={!state.isAutoStep}
          onClick={() => state.setIsAutoStep(false)}
        >
          Stop
        </button>
      </div>
      <div className="container">
        {state.agents.map((agent, agentIndex) => (
          <div
            className={`agent ${state.polledIndex === agentIndex && state.isPollingState && "polled"}`}
            key={agentIndex}
          >
            <div>Agent {agentIndex + 1}</div>
            <Agent {...agent} />
            {state.currentAgent === agentIndex && (
              <ExplainBox agentIndex={agentIndex} {...state} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};
