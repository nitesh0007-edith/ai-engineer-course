/// <reference lib="webworker" />
/**
 * Pyodide worker. Runs Python off the main thread so a heavy cell never freezes
 * the page. Pyodide (~10MB) is loaded from the CDN lazily on the first run, with
 * a graceful failure message if the network blocks it (CLAUDE.md §12).
 *
 * Protocol (main → worker):  { type: 'run', id, code, packages }
 * Protocol (worker → main):  { type: 'status', phase, detail }
 *                            { type: 'stdout', text }
 *                            { type: 'result', id, error, figures }
 */
const PYODIDE_VERSION = 'v314.0.2';
const CDN = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

// `any`: Pyodide is imported from the CDN at runtime and ships no types here.
let pyodide: any = null;
const loaded = new Set<string>();

// Capture matplotlib figures drawn during a run, as base64 PNGs, then clear.
const CAPTURE_FIGURES = `
import base64 as _b64, io as _io
_figs = []
try:
    import matplotlib.pyplot as _plt
    for _n in _plt.get_fignums():
        _buf = _io.BytesIO()
        _plt.figure(_n).savefig(_buf, format='png', dpi=110, bbox_inches='tight')
        _figs.append(_b64.b64encode(_buf.getvalue()).decode())
    _plt.close('all')
except Exception:
    pass
_figs
`;

function post(msg: unknown) {
  (self as unknown as Worker).postMessage(msg);
}

async function ensurePyodide() {
  if (pyodide) return;
  post({ type: 'status', phase: 'loading-runtime' });
  const { loadPyodide } = await import(/* @vite-ignore */ `${CDN}pyodide.mjs`);
  pyodide = await loadPyodide({ indexURL: CDN });
  pyodide.setStdout({ batched: (text: string) => post({ type: 'stdout', text }) });
  pyodide.setStderr({ batched: (text: string) => post({ type: 'stdout', text }) });
}

async function ensurePackages(packages: string[]) {
  const missing = packages.filter((p) => !loaded.has(p));
  if (missing.length === 0) return;
  post({ type: 'status', phase: 'loading-packages', detail: missing.join(', ') });
  await pyodide.loadPackage(missing);
  for (const p of missing) loaded.add(p);
}

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data;
  if (msg?.type !== 'run') return;
  const { id, code, packages = [] } = msg;

  try {
    await ensurePyodide();
    if (packages.length) await ensurePackages(packages);

    post({ type: 'status', phase: 'running' });
    await pyodide.runPythonAsync(code);

    let figures: string[] = [];
    try {
      const result = await pyodide.runPythonAsync(CAPTURE_FIGURES);
      figures = result?.toJs ? result.toJs() : Array.from(result ?? []);
      result?.destroy?.();
    } catch {
      /* matplotlib not in use — no figures */
    }

    post({ type: 'result', id, error: null, figures });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    post({ type: 'result', id, error: message, figures: [] });
  }
};
