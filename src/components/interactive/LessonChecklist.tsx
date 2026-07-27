import { useEffect, useId, useState } from "react";

export default function LessonChecklist({
  lessonId,
  items,
}: {
  lessonId: string;
  items: string[];
}) {
  const titleId = useId();
  const storageKey = `ai-engineer-course:v1:lesson:${lessonId}`;
  const [checked, setChecked] = useState<boolean[]>(() =>
    items.map(() => false),
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(stored))
        setChecked(items.map((_, index) => stored[index] === true));
    } catch {
      // Storage can be disabled. The checklist still works for this page visit.
    }
    setLoaded(true);
  }, [items.length, storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // Non-fatal: persistence is an enhancement.
    }
  }, [checked, loaded, storageKey]);

  const complete = checked.filter(Boolean).length;

  return (
    <section className="lesson-checklist sketch-card" aria-labelledby={titleId}>
      <div className="checklist-head">
        <h3 id={titleId}>Lesson checklist</h3>
        <span aria-live="polite">
          {complete} of {items.length} complete
        </span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${(complete / items.length) * 100}%` }} />
      </div>
      {items.map((item, index) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={checked[index]}
            onChange={() =>
              setChecked((old) =>
                old.map((value, i) => (i === index ? !value : value)),
              )
            }
          />
          <span>{item}</span>
        </label>
      ))}
    </section>
  );
}
