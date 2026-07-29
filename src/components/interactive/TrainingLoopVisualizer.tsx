import { useId, useMemo, useState } from "react";

type Schedule = "constant" | "warmup-decay";

type Point = {
  epoch: number;
  trainingLoss: number;
  validationLoss: number;
};

type Simulation = {
  points: Point[];
  totalUpdates: number;
  updatesPerEpoch: number;
  effectiveBatch: number;
  bestValidation: number;
  bestEpoch: number;
  finalTraining: number;
  finalValidation: number;
  clippedUpdates: number;
  unstable: boolean;
};

const DATASET_SIZE = 256;
const EPOCHS = 8;
const CLIP_NORM = 2.5;

/**
 * A deterministic one-parameter illustration, not a benchmark. The training
 * and validation sets deliberately prefer slightly different parameter values
 * so learners can see why the best validation checkpoint may precede the final
 * update. A fixed pair of sine waves stands in for batch-to-batch gradient
 * variation, keeping screenshots and tests repeatable.
 */
function simulate(
  learningRate: number,
  batchSize: number,
  accumulationSteps: number,
  schedule: Schedule,
  clipping: boolean,
): Simulation {
  const microBatchesPerEpoch = DATASET_SIZE / batchSize;
  const totalMicroBatches = microBatchesPerEpoch * EPOCHS;
  const totalUpdates = totalMicroBatches / accumulationSteps;
  const warmupUpdates =
    schedule === "warmup-decay" ? Math.max(1, Math.round(totalUpdates * 0.15)) : 0;
  const noiseScale = 0.7 * Math.sqrt(8 / batchSize);

  let weight = 3;
  let accumulatedGradient = 0;
  let clippedUpdates = 0;
  let update = 0;
  const points: Point[] = [
    {
      epoch: 0,
      trainingLoss: weight ** 2 + 0.05,
      validationLoss: (weight - 0.4) ** 2 + 0.18,
    },
  ];

  for (let microBatch = 1; microBatch <= totalMicroBatches; microBatch += 1) {
    const variation =
      noiseScale *
      (Math.sin(microBatch * 1.7) + 0.4 * Math.sin(microBatch * 0.37));
    accumulatedGradient += 2 * weight + variation;

    if (microBatch % accumulationSteps !== 0) continue;

    update += 1;
    let gradient = accumulatedGradient / accumulationSteps;
    accumulatedGradient = 0;

    if (clipping && Math.abs(gradient) > CLIP_NORM) {
      gradient = Math.sign(gradient) * CLIP_NORM;
      clippedUpdates += 1;
    }

    let rate = learningRate;
    if (schedule === "warmup-decay") {
      if (update <= warmupUpdates) {
        rate *= update / warmupUpdates;
      } else {
        const decayProgress =
          (update - warmupUpdates) / Math.max(1, totalUpdates - warmupUpdates);
        const cosine = 0.5 * (1 + Math.cos(Math.PI * decayProgress));
        rate *= 0.1 + 0.9 * cosine;
      }
    }

    weight -= rate * gradient;
    if (!Number.isFinite(weight) || Math.abs(weight) > 1_000_000) {
      weight = Math.sign(weight || 1) * 1_000_000;
    }

    points.push({
      epoch: microBatch / microBatchesPerEpoch,
      trainingLoss: Math.min(25, weight ** 2 + 0.05),
      validationLoss: Math.min(25, (weight - 0.4) ** 2 + 0.18),
    });
  }

  const best = points.reduce((current, point) =>
    point.validationLoss < current.validationLoss ? point : current,
  );
  const final = points.at(-1) ?? points[0];

  return {
    points,
    totalUpdates,
    updatesPerEpoch: microBatchesPerEpoch / accumulationSteps,
    effectiveBatch: batchSize * accumulationSteps,
    bestValidation: best.validationLoss,
    bestEpoch: best.epoch,
    finalTraining: final.trainingLoss,
    finalValidation: final.validationLoss,
    clippedUpdates,
    unstable:
      points.some(
        (point) => point.trainingLoss >= 25 || point.validationLoss >= 25,
      ) || final.trainingLoss > points[0].trainingLoss,
  };
}

function pathFor(
  points: Point[],
  key: "trainingLoss" | "validationLoss",
  maxLoss: number,
) {
  const left = 58;
  const right = 734;
  const top = 54;
  const bottom = 292;
  return points
    .map((point, index) => {
      const x = left + (point.epoch / EPOCHS) * (right - left);
      const y = bottom - (point[key] / maxLoss) * (bottom - top);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function TrainingLoopVisualizer() {
  const titleId = useId();
  const descriptionId = useId();
  const learningRateId = useId();
  const batchSizeId = useId();
  const accumulationId = useId();
  const scheduleId = useId();
  const clippingId = useId();
  const [learningRate, setLearningRate] = useState(0.12);
  const [batchSize, setBatchSize] = useState(32);
  const [accumulationSteps, setAccumulationSteps] = useState(1);
  const [schedule, setSchedule] = useState<Schedule>("warmup-decay");
  const [clipping, setClipping] = useState(false);

  const result = useMemo(
    () =>
      simulate(
        learningRate,
        batchSize,
        accumulationSteps,
        schedule,
        clipping,
      ),
    [learningRate, batchSize, accumulationSteps, schedule, clipping],
  );
  const maxLoss = Math.max(
    1,
    Math.min(
      25,
      Math.ceil(
        Math.max(
          ...result.points.flatMap((point) => [
            point.trainingLoss,
            point.validationLoss,
          ]),
        ),
      ),
    ),
  );
  const trainingPath = pathFor(result.points, "trainingLoss", maxLoss);
  const validationPath = pathFor(result.points, "validationLoss", maxLoss);

  return (
    <figure className="figure training-loop-lab">
      <div className="frame">
        <span className="frame-label">
          <span className="ref">LAB 02-04.A</span> · TRAINING CURVE WORKBENCH
        </span>

        <div className="training-loop-layout">
          <fieldset className="training-loop-controls">
            <legend>Experiment settings</legend>

            <label htmlFor={learningRateId}>
              Starting learning rate
              <output htmlFor={learningRateId}>{learningRate.toFixed(2)}</output>
            </label>
            <input
              id={learningRateId}
              type="range"
              min="0.02"
              max="1.2"
              step="0.02"
              value={learningRate}
              onChange={(event) => setLearningRate(Number(event.target.value))}
            />

            <label htmlFor={batchSizeId}>Examples per batch</label>
            <select
              id={batchSizeId}
              value={batchSize}
              onChange={(event) => setBatchSize(Number(event.target.value))}
            >
              <option value="8">8 — more variation</option>
              <option value="16">16</option>
              <option value="32">32</option>
              <option value="64">64 — fewer updates</option>
            </select>

            <label htmlFor={accumulationId}>Micro-batches per update</label>
            <select
              id={accumulationId}
              value={accumulationSteps}
              onChange={(event) =>
                setAccumulationSteps(Number(event.target.value))
              }
            >
              <option value="1">1 — every batch</option>
              <option value="2">2 — combine two</option>
              <option value="4">4 — combine four</option>
            </select>

            <label htmlFor={scheduleId}>Learning-rate rule</label>
            <select
              id={scheduleId}
              value={schedule}
              onChange={(event) => setSchedule(event.target.value as Schedule)}
            >
              <option value="warmup-decay">Warmup + decay</option>
              <option value="constant">Constant rate</option>
            </select>

            <label className="training-loop-check" htmlFor={clippingId}>
              <input
                id={clippingId}
                type="checkbox"
                checked={clipping}
                onChange={(event) => setClipping(event.target.checked)}
              />
              Clip gradient magnitude at {CLIP_NORM}
            </label>
          </fieldset>

          <div className="training-loop-plot">
            <svg
              className="diagram-svg"
              viewBox="0 0 780 350"
              role="img"
              aria-labelledby={`${titleId} ${descriptionId}`}
            >
              <title id={titleId}>Toy training and validation loss curves</title>
              <desc id={descriptionId}>
                {`Across ${EPOCHS} epochs, ${result.totalUpdates} optimiser updates produce a final training loss of ${result.finalTraining.toFixed(2)} and validation loss of ${result.finalValidation.toFixed(2)}. The lowest validation loss is ${result.bestValidation.toFixed(2)} near epoch ${result.bestEpoch.toFixed(1)}. Training is ${result.unstable ? "unstable at these settings" : "numerically stable in this illustration"}.`}
              </desc>

              <g
                stroke="var(--hairline)"
                strokeWidth="1"
                fill="none"
                aria-hidden="true"
              >
                <path d="M58 54 H734" />
                <path d="M58 173 H734" />
                <path d="M58 292 H734" />
              </g>
              <g
                fill="var(--ink-muted)"
                fontFamily="var(--font-mono)"
                fontSize="11"
                aria-hidden="true"
              >
                <text x="22" y="58">
                  {maxLoss}
                </text>
                <text x="30" y="177">
                  {(maxLoss / 2).toFixed(1)}
                </text>
                <text x="38" y="296">
                  0
                </text>
                <text x="54" y="323">
                  0
                </text>
                <text x="382" y="323">
                  4
                </text>
                <text x="724" y="323">
                  8
                </text>
                <text x="331" y="344">
                  training progress (epochs)
                </text>
              </g>

              <path
                d={trainingPath}
                fill="none"
                stroke="var(--blueprint)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={validationPath}
                fill="none"
                stroke="var(--annotate)"
                strokeWidth="4"
                strokeDasharray="10 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <g
                fontFamily="var(--font-mono)"
                fontSize="11"
                aria-hidden="true"
              >
                <line
                  x1="100"
                  y1="24"
                  x2="136"
                  y2="24"
                  stroke="var(--blueprint)"
                  strokeWidth="4"
                />
                <text x="143" y="28" fill="var(--ink)">
                  training · solid
                </text>
                <line
                  x1="292"
                  y1="24"
                  x2="328"
                  y2="24"
                  stroke="var(--annotate)"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                />
                <text x="335" y="28" fill="var(--ink)">
                  validation · dashed
                </text>
              </g>
            </svg>

            <dl className="training-loop-readout" aria-live="polite">
              <div>
                <dt>Updates / epoch</dt>
                <dd>{result.updatesPerEpoch}</dd>
              </div>
              <div>
                <dt>Effective batch</dt>
                <dd>{result.effectiveBatch}</dd>
              </div>
              <div>
                <dt>Best validation</dt>
                <dd>
                  {result.bestValidation.toFixed(2)} @ {result.bestEpoch.toFixed(1)}
                </dd>
              </div>
              <div>
                <dt>Clipped updates</dt>
                <dd>{clipping ? result.clippedUpdates : "off"}</dd>
              </div>
            </dl>

            <p
              className={`training-loop-status ${result.unstable ? "warning" : ""}`}
              role="status"
            >
              {result.unstable
                ? "This toy run is unstable. Return to a known-good rate, then change one control."
                : result.finalValidation > result.bestValidation * 1.1
                  ? "Training kept improving after validation passed its best point. The best checkpoint is earlier."
                  : "The curves are stable here. That is necessary evidence, not proof that the model is useful."}
            </p>
          </div>
        </div>
      </div>
      <figcaption>
        <span className="ref">LAB 02-04.A</span>
        Change one setting at a time. This deterministic one-parameter model
        illustrates update count, batch variation, warmup and decay, accumulation,
        clipping, and validation-based checkpoint selection; it does not predict a
        real model’s accuracy.
      </figcaption>
    </figure>
  );
}
