# Project rules

- Preserve every published lesson route. Add redirects only when a route change is unavoidable.
- Write for complete beginners. Explain a term in plain English before using its technical detail or abbreviation.
- Teach in this order where practical: plain explanation, analogy, visual, small example, mechanics, code, real use, mistakes, practice, revision.
- Keep paragraphs short and introduce one important idea at a time.
- Keep educational content separate from presentation. Author lessons in MDX or structured content and render them with shared components.
- Use the shared sketchnote lesson components. Do not copy large blocks of lesson markup between chapters.
- Keep core educational text as semantic, selectable and searchable HTML.
- Give every meaningful diagram a caption and an accessible description. Do not encode essential meaning by colour alone.
- Ground quizzes, flashcards, summaries and revision questions in content taught by the lesson.
- Test runnable code and verify its expected output.
- Do not invent facts, statistics, benchmarks, citations or tool behaviour.
- Keep the site static and compatible with GitHub Pages at `/ai-engineer-course/`.
- Preserve keyboard access, visible focus states, WCAG AA contrast, reduced-motion support and print usability.
- Avoid unnecessary dependencies. Prefer Astro and CSS for static UI and React islands only for stateful interactions.
- Make incremental changes and preserve unrelated work in a dirty worktree.
- Complete one lesson properly instead of publishing placeholders.
- Keep unpublished or incomplete lessons out of public navigation.
- Run `pnpm check`, `pnpm build`, `pnpm check:manifest` and relevant Playwright tests after meaningful changes.

## Completed lesson checklist

A published lesson needs metadata, why it matters, a main idea, measurable objectives,
defined terminology, a beginner explanation, an honest analogy, an accessible diagram,
a worked example, code and expected output where appropriate, a real-world use, common
mistakes, an explained knowledge check, a practice task and solution, key takeaways,
flashcards, revision questions, a printable summary, progress tracking, and previous/next
navigation.
