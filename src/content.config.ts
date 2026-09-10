import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 长文：各模块的正式标本
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    module: z.enum(['travel', 'ai-lab', 'math-notes', 'reading', 'music']),
    specimen: z.string().regex(/^RS-\d{4}$/, '标本编号格式：RS-XXXX'),
    status: z.enum(['seed', 'growing', 'evergreen']),
    draft: z.boolean().default(false), // draft: true 不发布
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    description: z.string().default(''),
  }),
});

// 随想：碎片片段，去卡片化呈现，可标注来源模块
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    specimen: z.string().regex(/^RS-F-\d{4}$/, '随想编号格式：RS-F-XXXX'),
    status: z.enum(['seed', 'growing', 'evergreen']).default('seed'),
    draft: z.boolean().default(false),
    date: z.coerce.date(),
    module: z.enum(['travel', 'ai-lab', 'math-notes', 'reading', 'music']).optional(),
  }),
});

export const collections = { posts, notes };
