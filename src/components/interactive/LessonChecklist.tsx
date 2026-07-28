import { useEffect, useId, useState } from "react";
import { supabase } from '../../lib/supabase';

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

  // Logged-in learners keep the same checklist when they return on another
  // device. Guest progress remains local and is never uploaded without a
  // signed-in user.
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!active || !userData.user) return;
      const { data } = await supabase
        .from('lesson_progress')
        .select('completed_items')
        .eq('user_id', userData.user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();
      if (!active || !Array.isArray(data?.completed_items)) return;
      setChecked((local) =>
        items.map((_, index) => local[index] === true || data.completed_items[index] === true),
      );
    })();
    return () => { active = false; };
  }, [items.length, lessonId]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // Non-fatal: persistence is an enhancement.
    }
  }, [checked, loaded, storageKey]);

  useEffect(() => {
    if (!loaded || !supabase) return;
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const allComplete = checked.length > 0 && checked.every(Boolean);
      await supabase.from('lesson_progress').upsert(
        {
          user_id: userData.user.id,
          lesson_id: lessonId,
          completed_items: checked,
          completed_at: allComplete ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' },
      );
    })();
  }, [checked, lessonId, loaded]);

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
