import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    author: z.string().optional().default(''),
    reviewedBy: z.string().optional().default(''),
    authorUrl: z.string().optional().default(''),
    reviewerUrl: z.string().optional().default(''),
    category: z.string(),
    image: z.string().optional().default(''),
    imageAlt: z.string().optional().default(''),
    canonical: z.string(),
    draft: z.boolean().default(false),
    relatedPages: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    slug: z.string(),
    isPillar: z.boolean().default(false),
    related: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, topics };
