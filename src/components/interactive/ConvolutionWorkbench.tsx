import { useEffect, useId, useMemo, useState } from "react";

type Pattern = "vertical" | "horizontal" | "point" | "checker";
type Filter = "vertical" | "horizontal" | "average" | "sharpen";

const PATTERNS: Record<Pattern, number[][]> = {
  vertical: [
    [0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1],
  ],
  horizontal: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ],
  point: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  checker: [
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
  ],
};

const FILTERS: Record<Filter, number[][]> = {
  vertical: [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
  ],
  horizontal: [
    [-1, -1, -1],
    [0, 0, 0],
    [1, 1, 1],
  ],
  average: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],
  sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
};

function paddedValue(image: number[][], row: number, column: number) {
  if (
    row < 0 ||
    column < 0 ||
    row >= image.length ||
    column >= image[0].length
  ) {
    return 0;
  }
  return image[row][column];
}

function crossCorrelate(
  image: number[][],
  kernel: number[][],
  stride: number,
  padding: number,
) {
  const outputSize =
    Math.floor((image.length + 2 * padding - kernel.length) / stride) + 1;
  const patches: number[][][][] = [];
  const output: number[][] = [];

  for (let outputRow = 0; outputRow < outputSize; outputRow += 1) {
    const outputLine: number[] = [];
    const patchLine: number[][][] = [];
    for (let outputColumn = 0; outputColumn < outputSize; outputColumn += 1) {
      const patch = kernel.map((kernelRow, rowOffset) =>
        kernelRow.map((_, columnOffset) =>
          paddedValue(
            image,
            outputRow * stride + rowOffset - padding,
            outputColumn * stride + columnOffset - padding,
          ),
        ),
      );
      const value = patch.reduce(
        (total, row, rowIndex) =>
          total +
          row.reduce(
            (rowTotal, item, columnIndex) =>
              rowTotal + item * kernel[rowIndex][columnIndex],
            0,
          ),
        0,
      );
      outputLine.push(value);
      patchLine.push(patch);
    }
    output.push(outputLine);
    patches.push(patchLine);
  }

  return { output, patches };
}

function format(value: number) {
  const rounded = Math.abs(value) < 0.0005 ? 0 : value;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function NumberTable({
  caption,
  values,
  highlighted,
}: {
  caption: string;
  values: number[][];
  highlighted?: boolean[][];
}) {
  return (
    <table className="convolution-grid">
      <caption>{caption}</caption>
      <tbody>
        {values.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((value, columnIndex) => (
              <td
                className={highlighted?.[rowIndex]?.[columnIndex] ? "active" : ""}
                key={columnIndex}
              >
                {format(value)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ConvolutionWorkbench() {
  const patternId = useId();
  const filterId = useId();
  const strideId = useId();
  const paddingId = useId();
  const [pattern, setPattern] = useState<Pattern>("vertical");
  const [filter, setFilter] = useState<Filter>("vertical");
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(0);
  const [selected, setSelected] = useState({ row: 0, column: 0 });

  const image = PATTERNS[pattern];
  const kernel = FILTERS[filter];
  const result = useMemo(
    () => crossCorrelate(image, kernel, stride, padding),
    [image, kernel, stride, padding],
  );

  useEffect(() => {
    const last = result.output.length - 1;
    setSelected((current) => ({
      row: Math.min(current.row, last),
      column: Math.min(current.column, last),
    }));
  }, [result.output.length]);

  const lastOutputIndex = result.output.length - 1;
  const selectedRow = Math.min(selected.row, lastOutputIndex);
  const selectedColumn = Math.min(selected.column, lastOutputIndex);
  const patch = result.patches[selectedRow][selectedColumn];
  const products = patch.map((row, rowIndex) =>
    row.map((value, columnIndex) => value * kernel[rowIndex][columnIndex]),
  );
  const selectedValue = result.output[selectedRow][selectedColumn];
  const imageHighlight = image.map((row, rowIndex) =>
    row.map((_, columnIndex) => {
      const sourceRow = selectedRow * stride - padding;
      const sourceColumn = selectedColumn * stride - padding;
      return (
        rowIndex >= sourceRow &&
        rowIndex < sourceRow + kernel.length &&
        columnIndex >= sourceColumn &&
        columnIndex < sourceColumn + kernel.length
      );
    }),
  );

  return (
    <figure className="figure convolution-lab">
      <div className="frame">
        <span className="frame-label">
          <span className="ref">LAB 02-06.A</span> · SLIDE, MULTIPLY, SUM
        </span>

        <fieldset className="convolution-controls">
          <legend>Convolution settings</legend>
          <label htmlFor={patternId}>
            Input pattern
            <select
              id={patternId}
              value={pattern}
              onChange={(event) => setPattern(event.target.value as Pattern)}
            >
              <option value="vertical">Vertical boundary</option>
              <option value="horizontal">Horizontal boundary</option>
              <option value="point">Single bright point</option>
              <option value="checker">Checker pattern</option>
            </select>
          </label>
          <label htmlFor={filterId}>
            Shared filter
            <select
              id={filterId}
              value={filter}
              onChange={(event) => setFilter(event.target.value as Filter)}
            >
              <option value="vertical">Vertical edge</option>
              <option value="horizontal">Horizontal edge</option>
              <option value="average">3 × 3 average</option>
              <option value="sharpen">Sharpen centre</option>
            </select>
          </label>
          <label htmlFor={strideId}>
            Stride
            <select
              id={strideId}
              value={stride}
              onChange={(event) => setStride(Number(event.target.value))}
            >
              <option value="1">1 — visit every position</option>
              <option value="2">2 — skip alternate positions</option>
            </select>
          </label>
          <label htmlFor={paddingId}>
            Zero padding
            <select
              id={paddingId}
              value={padding}
              onChange={(event) => setPadding(Number(event.target.value))}
            >
              <option value="0">0 — valid positions only</option>
              <option value="1">1 — one-cell border</option>
            </select>
          </label>
        </fieldset>

        <div className="convolution-stage" aria-live="polite">
          <NumberTable
            caption="5 × 5 input"
            values={image}
            highlighted={imageHighlight}
          />
          <span className="convolution-operator" aria-hidden="true">×</span>
          <NumberTable caption="3 × 3 shared filter" values={kernel} />
          <span className="convolution-operator" aria-hidden="true">→</span>
          <table className="convolution-grid convolution-output" data-map="output">
            <caption>
              {result.output.length} × {result.output.length} feature map
            </caption>
            <tbody>
              {result.output.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((value, columnIndex) => (
                    <td key={columnIndex}>
                      <button
                        type="button"
                        className={
                          selectedRow === rowIndex && selectedColumn === columnIndex
                            ? "selected"
                            : ""
                        }
                        aria-pressed={
                          selectedRow === rowIndex && selectedColumn === columnIndex
                        }
                        aria-label={`Inspect output row ${rowIndex + 1}, column ${columnIndex + 1}, value ${format(value)}`}
                        onClick={() => setSelected({ row: rowIndex, column: columnIndex })}
                      >
                        {format(value)}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="convolution-arithmetic">
          <div>
            <p className="workbench-kicker">Selected input patch</p>
            <NumberTable caption="Values under the filter" values={patch} />
          </div>
          <div>
            <p className="workbench-kicker">Element-wise products</p>
            <NumberTable caption="Patch value × filter weight" values={products} />
          </div>
          <div className="convolution-sum" data-selected-value={format(selectedValue)}>
            <p className="workbench-kicker">Sum becomes one output</p>
            <strong>{format(selectedValue)}</strong>
            <p>
              output row {selectedRow + 1}, column {selectedColumn + 1}
            </p>
          </div>
        </section>

        <p className="convolution-note">
          The same nine filter weights are reused at every valid position. Padding
          contributes explicit zeros outside the input; it does not invent new
          observed pixels.
        </p>
      </div>
      <figcaption>
        <span className="ref">LAB 02-06.A</span> — choose a pattern, filter,
        stride, and padding. Select any output cell to reveal the exact local
        patch, nine products, and sum that created it.
      </figcaption>
    </figure>
  );
}
