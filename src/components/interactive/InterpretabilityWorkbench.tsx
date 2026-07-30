import { useId, useMemo, useState } from "react";

type Channel = "email" | "chat" | "phone";

type Contribution = {
  label: string;
  value: number;
};

const HOURS = Array.from({ length: 13 }, (_, index) => index * 2);
const CHANNELS: Channel[] = ["email", "chat", "phone"];

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function terms(waitingHours: number, contacts: number, channel: Channel) {
  const channelTerm = channel === "chat" ? -0.25 : channel === "phone" ? 0.2 : 0;
  const interactionRate =
    channel === "chat" ? 0.05 : channel === "phone" ? -0.05 : 0;

  return {
    baseline: -2.4,
    waiting: 0.16 * waitingHours,
    contacts: 0.48 * contacts,
    channel: channelTerm,
    interaction: interactionRate * waitingHours,
  };
}

function probability(waitingHours: number, contacts: number, channel: Channel) {
  return sigmoid(
    Object.values(terms(waitingHours, contacts, channel)).reduce(
      (total, value) => total + value,
      0,
    ),
  );
}

function averageProbability(waitingHours: number) {
  const values = CHANNELS.flatMap((channel) =>
    [0, 1, 2].map((contacts) =>
      probability(waitingHours, contacts, channel),
    ),
  );
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function pathFor(values: number[]) {
  const left = 54;
  const right = 650;
  const top = 35;
  const bottom = 238;

  return values
    .map((value, index) => {
      const x = left + (index / (values.length - 1)) * (right - left);
      const y = bottom - value * (bottom - top);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function InterpretabilityWorkbench() {
  const titleId = useId();
  const descriptionId = useId();
  const waitingId = useId();
  const contactsId = useId();
  const channelId = useId();
  const [waitingHours, setWaitingHours] = useState(8);
  const [contacts, setContacts] = useState(1);
  const [channel, setChannel] = useState<Channel>("email");

  const currentTerms = terms(waitingHours, contacts, channel);
  const score = Object.values(currentTerms).reduce(
    (total, value) => total + value,
    0,
  );
  const currentProbability = sigmoid(score);

  const contributions: Contribution[] = [
    { label: "Baseline", value: currentTerms.baseline },
    { label: "Waiting time", value: currentTerms.waiting },
    { label: "Previous contacts", value: currentTerms.contacts },
    { label: "Channel", value: currentTerms.channel },
    { label: "Wait × channel", value: currentTerms.interaction },
  ];

  const curves = useMemo(
    () => ({
      average: HOURS.map((hours) => averageProbability(hours)),
      chat: HOURS.map((hours) => probability(hours, 1, "chat")),
      phone: HOURS.map((hours) => probability(hours, 1, "phone")),
    }),
    [],
  );

  const selectedX = 54 + (waitingHours / 24) * (650 - 54);
  const selectedY = 238 - averageProbability(waitingHours) * (238 - 35);

  return (
    <figure className="figure interpretability-lab">
      <div className="frame">
        <span className="frame-label">
          <span className="ref">LAB 01-08.A</span> · EXPLANATION WORKBENCH
        </span>

        <div className="interpretability-layout">
          <fieldset className="interpretability-controls">
            <legend>Toy support ticket</legend>

            <label htmlFor={waitingId}>
              Waiting time
              <output htmlFor={waitingId}>{waitingHours} hours</output>
            </label>
            <input
              id={waitingId}
              type="range"
              min="0"
              max="24"
              step="1"
              value={waitingHours}
              onChange={(event) => setWaitingHours(Number(event.target.value))}
            />

            <label htmlFor={contactsId}>Previous contacts</label>
            <select
              id={contactsId}
              value={contacts}
              onChange={(event) => setContacts(Number(event.target.value))}
            >
              <option value="0">0 contacts</option>
              <option value="1">1 contact</option>
              <option value="2">2 contacts</option>
            </select>

            <label htmlFor={channelId}>Support channel</label>
            <select
              id={channelId}
              value={channel}
              onChange={(event) =>
                setChannel(event.target.value as Channel)
              }
            >
              <option value="email">Email</option>
              <option value="chat">Chat</option>
              <option value="phone">Phone</option>
            </select>

            <div className="interpretability-score" aria-live="polite">
              <span>Predicted escalation</span>
              <strong>{(currentProbability * 100).toFixed(1)}%</strong>
              <small>teaching model, not a production estimate</small>
            </div>
          </fieldset>

          <section
            className="contribution-panel"
            aria-labelledby={`${titleId}-local`}
          >
            <p className="workbench-kicker">Local question</p>
            <h3 id={`${titleId}-local`}>Why this prediction?</h3>
            <div className="contribution-list">
              {contributions.map((contribution) => {
                const width = Math.min(
                  100,
                  (Math.abs(contribution.value) / 2.4) * 100,
                );
                return (
                  <div className="contribution-row" key={contribution.label}>
                    <span>{contribution.label}</span>
                    <div
                      className={`contribution-track ${
                        contribution.value >= 0 ? "positive" : "negative"
                      }`}
                    >
                      <span style={{ width: `${width}%` }} />
                    </div>
                    <output>
                      {contribution.value >= 0 ? "+" : ""}
                      {contribution.value.toFixed(2)}
                    </output>
                  </div>
                );
              })}
            </div>
            <p className="contribution-note">
              Positive terms raise the model score; negative terms lower it.
              These bars are the exact terms of this tiny formula—not SHAP or
              LIME, and not evidence of cause.
            </p>
          </section>
        </div>

        <section className="dependence-panel">
          <div>
            <p className="workbench-kicker">Global question</p>
            <h3>How does the model respond as waiting time changes?</h3>
          </div>
          <svg
            className="diagram-svg"
            viewBox="0 0 700 300"
            role="img"
            aria-labelledby={`${titleId} ${descriptionId}`}
          >
            <title id={titleId}>
              Model response across waiting time for an average and two channels
            </title>
            <desc id={descriptionId}>
              {`The solid average curve and dashed channel curves show predicted escalation from zero to twenty-four waiting hours. At ${waitingHours} hours, the average curve is ${(averageProbability(waitingHours) * 100).toFixed(1)} percent. Chat rises faster than phone, so the average hides subgroup behaviour.`}
            </desc>

            <g
              stroke="var(--hairline)"
              strokeWidth="1"
              fill="none"
              aria-hidden="true"
            >
              <path d="M54 35 V238 H650" />
              <path d="M54 136.5 H650" strokeDasharray="4 5" />
            </g>
            <g
              fill="var(--ink-muted)"
              fontFamily="var(--font-mono)"
              fontSize="10"
              aria-hidden="true"
            >
              <text x="23" y="40">100%</text>
              <text x="29" y="140">50%</text>
              <text x="36" y="242">0%</text>
              <text x="50" y="261">0h</text>
              <text x="337" y="261">12h</text>
              <text x="632" y="261">24h</text>
            </g>
            <path
              d={pathFor(curves.average)}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="4"
            />
            <path
              d={pathFor(curves.chat)}
              fill="none"
              stroke="var(--blueprint)"
              strokeWidth="3"
              strokeDasharray="9 5"
            />
            <path
              d={pathFor(curves.phone)}
              fill="none"
              stroke="var(--alert)"
              strokeWidth="3"
              strokeDasharray="2 6"
            />
            <line
              x1={selectedX}
              y1="35"
              x2={selectedX}
              y2="238"
              stroke="var(--ch1)"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <circle
              cx={selectedX}
              cy={selectedY}
              r="6"
              fill="var(--paper-raise)"
              stroke="var(--ink)"
              strokeWidth="3"
            />
            <g
              fill="var(--ink)"
              fontFamily="var(--font-mono)"
              fontSize="10"
              aria-hidden="true"
            >
              <text x="78" y="58">solid · average</text>
              <text x="78" y="76" fill="var(--blueprint)">
                dashed · chat, 1 contact
              </text>
              <text x="78" y="94" fill="var(--alert)">
                dotted · phone, 1 contact
              </text>
            </g>
          </svg>
          <p className="dependence-note">
            This is partial-dependence-like: it changes one input across fixed
            background rows and averages predictions. The channel curves reveal
            behaviour the average alone would conceal.
          </p>
        </section>
      </div>
      <figcaption>
        <span className="ref">LAB 01-08.A</span> — change the ticket, compare a
        local score breakdown with a global response curve, and notice that
        explanation answers depend on the question asked.
      </figcaption>
    </figure>
  );
}
