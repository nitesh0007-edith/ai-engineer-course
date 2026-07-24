import { useEffect, useRef, useState, useId } from 'react';

interface Props {
  /** Initial Python source. */
  code: string;
  /** Optional worked solution, revealable. */
  solution?: string;
  /** Pyodide packages to preload (e.g. ["numpy", "matplotlib"]). */
  packages?: string[];
  /** LAB label parts (DESIGN §6.1), e.g. id="00-00.A" label="RUN PYTHON HERE". */
  id?: string;
  label?: string;
}

type Phase = 'idle' | 'loading-runtime' | 'loading-packages' | 'running' | 'done' | 'error';

const PHASE_TEXT: Record<Phase, string> = {
  idle: 'IDLE',
  'loading-runtime': 'LOADING PYTHON…',
  'loading-packages': 'LOADING PACKAGES…',
  running: 'RUNNING…',
  done: 'DONE',
  error: 'ERROR',
};

export default function PyRunner({ code, solution, packages = [], id, label }: Props) {
  const [source, setSource] = useState(code);
  const [output, setOutput] = useState('');
  const [figures, setFigures] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [busy, setBusy] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const runIdRef = useRef(0);
  const labId = useId();

  useEffect(() => {
    return () => workerRef.current?.terminate();
  }, []);

  function ensureWorker(): Worker {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker(new URL('../../lib/pyodide/worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === 'status') setPhase(msg.phase as Phase);
      else if (msg.type === 'stdout') setOutput((o) => o + msg.text);
      else if (msg.type === 'result') {
        if (msg.id !== runIdRef.current) return;
        setFigures(msg.figures ?? []);
        setError(msg.error);
        setPhase(msg.error ? 'error' : 'done');
        setBusy(false);
      }
    };
    worker.onerror = () => {
      setError('Could not start the Python runtime.');
      setPhase('error');
      setBusy(false);
    };
    workerRef.current = worker;
    return worker;
  }

  function run() {
    setBusy(true);
    setOutput('');
    setFigures([]);
    setError(null);
    setPhase('loading-runtime');
    const worker = ensureWorker();
    const runId = ++runIdRef.current;
    worker.postMessage({ type: 'run', id: runId, code: source, packages });
  }

  function reset() {
    setSource(code);
    setOutput('');
    setFigures([]);
    setError(null);
    setPhase('idle');
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!busy) run();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const next = source.slice(0, s) + '    ' + source.slice(ta.selectionEnd);
      setSource(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 4;
      });
    }
  }

  const lines = source.split('\n').length;

  return (
    <figure className="figure lab">
      <div className="frame lab-frame">
        {(id || label) && (
          <span className="frame-label">
            <span className="ref">LAB {id}</span>
            {label ? ` · ${label}` : ''}
          </span>
        )}

        <div className="lab-body">
          <label className="visually-hidden" htmlFor={labId}>
            Editable Python code
          </label>
          <textarea
            id={labId}
            className="py-editor"
            value={source}
            spellCheck={false}
            rows={Math.min(Math.max(lines, 3), 22)}
            onChange={(e) => setSource(e.target.value)}
            onKeyDown={onKeyDown}
          />

          <div className="lab-controls">
            <button type="button" className="lab-btn primary" onClick={run} disabled={busy}>
              {busy ? '…' : '▶ Run'}
            </button>
            <button type="button" className="lab-btn" onClick={reset} disabled={busy}>
              Reset
            </button>
            {solution && (
              <button
                type="button"
                className="lab-btn"
                onClick={() => setSource(solution)}
                disabled={busy}
              >
                Reveal solution
              </button>
            )}
            <span className="lab-status" role="status" aria-live="polite">
              {PHASE_TEXT[phase]}
            </span>
            <span className="lab-hint">⌘↵ to run</span>
          </div>

          {(output || error || figures.length > 0 || phase === 'done') && (
            <div className="lab-output" aria-live="polite">
              {output && <pre className="py-out">{output}</pre>}
              {error && <pre className="py-err">{error}</pre>}
              {figures.map((b64, i) => (
                <img
                  key={i}
                  className="py-fig"
                  src={`data:image/png;base64,${b64}`}
                  alt="Figure produced by the code above"
                />
              ))}
              {!output && !error && figures.length === 0 && phase === 'done' && (
                <p className="py-noout">Ran with no output.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
