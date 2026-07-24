import { useEffect, useRef, useState } from 'react';

type Result = { url: string; title: string; excerpt: string };

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

// Prepend the project base path to a Pagefind-recorded URL if it isn't there.
function withBase(url: string): string {
  if (BASE && !url.startsWith(BASE)) return `${BASE}${url}`;
  return url;
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'unavailable'>('idle');
  // `any`: the Pagefind bundle is loaded from the built site at runtime, untyped.
  const pagefindRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl-K to open, Esc to close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lazy-load the Pagefind bundle the first time the modal opens.
  useEffect(() => {
    if (!open || pagefindRef.current || status === 'unavailable') return;
    (async () => {
      try {
        const mod = await import(/* @vite-ignore */ `${BASE}/pagefind/pagefind.js`);
        await mod.init?.();
        pagefindRef.current = mod;
        setStatus('ready');
      } catch {
        setStatus('unavailable');
      }
    })();
  }, [open, status]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!pagefindRef.current || !query.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const search = await pagefindRef.current.search(query);
      const data = await Promise.all(search.results.slice(0, 6).map((r: any) => r.data()));
      if (cancelled) return;
      setResults(
        data.map((d: any) => ({
          url: withBase(d.url),
          title: d.meta?.title ?? d.url,
          excerpt: d.excerpt ?? '',
        })),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search the course"
      >
        <span aria-hidden="true">Search</span>
        <kbd>⌘K</kbd>
      </button>

      {open && (
        <div className="search-overlay" onClick={() => setOpen(false)}>
          <div
            className="search-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="search"
              className="search-input"
              placeholder="Search chapters…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-results">
              {status === 'unavailable' && (
                <p className="search-empty">Search runs against the built site.</p>
              )}
              {status !== 'unavailable' && query && results.length === 0 && (
                <p className="search-empty">No matches.</p>
              )}
              {results.map((r) => (
                <a key={r.url} href={r.url} className="search-result">
                  <span className="sr-title">{r.title}</span>
                  <span className="sr-excerpt" dangerouslySetInnerHTML={{ __html: r.excerpt }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
