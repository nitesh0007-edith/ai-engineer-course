import { useId, useMemo, useState } from "react";

type Composition = "balanced" | "outlier" | "tiny";

const BASE = [1, 2, 4, 8];
const EPSILON = 1e-8;

function mean(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function populationSpread(values: number[]) {
  const centre = mean(values);
  return Math.sqrt(
    values.reduce((total, value) => total + (value - centre) ** 2, 0) /
      values.length +
      EPSILON,
  );
}

function layerNormalise(row: number[]) {
  const centre = mean(row);
  const spread = populationSpread(row);
  return row.map((value) => (value - centre) / spread);
}

function rmsNormalise(row: number[]) {
  const rms = Math.sqrt(
    row.reduce((total, value) => total + value ** 2, 0) / row.length +
      EPSILON,
  );
  return row.map((value) => value / rms);
}

function batchNormalise(batch: number[][]) {
  const featureCount = batch[0].length;
  const centres = Array.from({ length: featureCount }, (_, feature) =>
    mean(batch.map((row) => row[feature])),
  );
  const spreads = Array.from({ length: featureCount }, (_, feature) =>
    populationSpread(batch.map((row) => row[feature])),
  );

  return batch.map((row) =>
    row.map(
      (value, feature) =>
        (value - centres[feature]) / spreads[feature],
    ),
  );
}

function makeBatch(composition: Composition, shift: number) {
  const selected = BASE.map((value) => value + shift);
  if (composition === "tiny") {
    return [selected, BASE.map((value) => value + 1)];
  }
  if (composition === "outlier") {
    return [
      selected,
      BASE.map((value) => value + 1),
      BASE.map((value) => value + 2),
      [20, 20, 20, 20],
    ];
  }
  return [
    selected,
    BASE.map((value) => value + 1),
    BASE.map((value) => value + 2),
    BASE.map((value) => value + 3),
  ];
}

function format(value: number) {
  const rounded = Math.abs(value) < 0.0005 ? 0 : value;
  return `${rounded >= 0 ? "+" : ""}${rounded.toFixed(2)}`;
}

function ValueStrip({ values }: { values: number[] }) {
  return (
    <div className="normalisation-values">
      {values.map((value, index) => {
        const width = Math.min(50, (Math.abs(value) / 2) * 50);
        return (
          <div className="normalisation-value" key={index}>
            <span className="normalisation-feature">f{index + 1}</span>
            <span className="normalisation-track" aria-hidden="true">
              <span
                className={value >= 0 ? "positive" : "negative"}
                style={{ width: `${width}%` }}
              />
            </span>
            <output>{format(value)}</output>
          </div>
        );
      })}
    </div>
  );
}

export default function NormalisationWorkbench() {
  const compositionId = useId();
  const shiftId = useId();
  const [composition, setComposition] =
    useState<Composition>("balanced");
  const [shift, setShift] = useState(0);

  const result = useMemo(() => {
    const batch = makeBatch(composition, shift);
    const selected = batch[0];
    return {
      batch,
      selected,
      batchOutput: batchNormalise(batch)[0],
      layerOutput: layerNormalise(selected),
      rmsOutput: rmsNormalise(selected),
      selectedMean: mean(selected),
      selectedSpread: populationSpread(selected),
      selectedRms: Math.sqrt(mean(selected.map((value) => value ** 2))),
    };
  }, [composition, shift]);

  return (
    <figure className="figure normalisation-lab">
      <div className="frame">
        <span className="frame-label">
          <span className="ref">LAB 02-05.A</span> · CHOOSE THE AXIS
        </span>

        <div className="normalisation-controls">
          <label htmlFor={compositionId}>
            Batch composition
            <select
              id={compositionId}
              value={composition}
              onChange={(event) =>
                setComposition(event.target.value as Composition)
              }
            >
              <option value="balanced">Four nearby examples</option>
              <option value="outlier">Three nearby + one outlier</option>
              <option value="tiny">Tiny batch of two</option>
            </select>
          </label>

          <label htmlFor={shiftId}>
            Uniform shift added to selected example
            <output htmlFor={shiftId}>
              {shift >= 0 ? "+" : ""}
              {shift}
            </output>
            <input
              id={shiftId}
              type="range"
              min="-3"
              max="6"
              step="1"
              value={shift}
              onChange={(event) => setShift(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="normalisation-matrix-wrap">
          <table className="normalisation-matrix">
            <caption>Current training mini-batch</caption>
            <thead>
              <tr>
                <th scope="col">example</th>
                {BASE.map((_, index) => (
                  <th scope="col" key={index}>
                    f{index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.batch.map((row, rowIndex) => (
                <tr className={rowIndex === 0 ? "selected" : ""} key={rowIndex}>
                  <th scope="row">
                    {rowIndex === 0 ? "selected" : `peer ${rowIndex}`}
                  </th>
                  {row.map((value, feature) => (
                    <td key={feature}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="normalisation-results" aria-live="polite">
          <section className="normalisation-method" data-method="batch">
            <p className="workbench-kicker">Across examples · per feature</p>
            <h3>Batch normalisation</h3>
            <ValueStrip values={result.batchOutput} />
            <p>
              Uses all {result.batch.length} rows shown. Change the batch and
              this selected row changes.
            </p>
          </section>

          <section className="normalisation-method" data-method="layer">
            <p className="workbench-kicker">Across features · one example</p>
            <h3>Layer normalisation</h3>
            <ValueStrip values={result.layerOutput} />
            <p>
              Selected mean {result.selectedMean.toFixed(2)} · spread{" "}
              {result.selectedSpread.toFixed(2)}. A uniform shift is removed
              by centring.
            </p>
          </section>

          <section className="normalisation-method" data-method="rms">
            <p className="workbench-kicker">Across squared features · one example</p>
            <h3>RMS normalisation</h3>
            <ValueStrip values={result.rmsOutput} />
            <p>
              Selected root mean square {result.selectedRms.toFixed(2)}. No
              mean is subtracted, so a uniform shift still matters.
            </p>
          </section>
        </div>

        <p className="normalisation-warning">
          Teaching calculation: learnable scale and bias are fixed to identity,
          and the tiny epsilon is omitted from displayed statistics. Production
          modules include those details.
        </p>
      </div>
      <figcaption>
        <span className="ref">LAB 02-05.A</span> — change who shares the
        mini-batch and shift the selected example. BatchNorm depends on its
        neighbours; LayerNorm and RMSNorm do not, while only LayerNorm centres.
      </figcaption>
    </figure>
  );
}
