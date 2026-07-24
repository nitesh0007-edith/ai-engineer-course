import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'dark' ? 'dark' : 'light';
}

/**
 * Theme toggle. The initial theme is resolved by a blocking inline script in the
 * <head> (see Base.astro) so there is no flash; this island only reflects and
 * mutates that state, persisting the choice in localStorage (an allowed
 * preference use per CLAUDE.md §15 / DESIGN §9).
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  // Hydrate from the DOM the inline script already set.
  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode / storage disabled — non-fatal, theme still applies */
    }
    setTheme(next);
  }

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="theme-toggle"
    >
      <span aria-hidden="true">{isDark ? '◐ DARK' : '◑ LIGHT'}</span>
    </button>
  );
}
