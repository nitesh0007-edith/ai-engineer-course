import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The chapter contract, enforced mechanically (CLAUDE.md §6).
 *
 * A chapter MDX file that does not meet this schema fails the build. The
 * `.min(...)` floors are the teeth: every chapter must carry at least two
 * diagrams, one interactive, two code examples, three objectives, three
 * concepts, three exercises (each with a solution), and three resources.
 */
const chapters = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/chapters' }),
  schema: z.object({
    layer: z.number().min(0).max(10),
    order: z.number(),
    title: z.string(),
    slug: z.string(),
    subtitle: z.string(),
    // Roadmap depth tiers.
    depth: z.enum(['build', 'use', 'know']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    readingTime: z.number(), // minutes, honest estimate
    prerequisites: z.array(z.string()), // chapter slugs
    objectives: z.array(z.string()).min(3), // "By the end you can…"
    concepts: z.array(z.string()).min(3), // glossary term ids introduced
    diagrams: z.array(z.string()).min(2), // component names — MIN 2
    interactives: z.array(z.string()).min(1), // widget names — MIN 1
    codeExamples: z.number().min(2),
    exercises: z
      .array(
        z.object({
          prompt: z.string(),
          difficulty: z.enum(['warmup', 'core', 'stretch']),
          solution: z.string(), // every exercise has a solution
        }),
      )
      .min(3),
    resources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          type: z.enum(['paper', 'docs', 'video', 'course', 'blog', 'repo']),
        }),
      )
      .min(3),
    status: z.enum(['draft', 'review', 'published']),
    updated: z.coerce.date(),
  }),
});

export const collections = { chapters };
