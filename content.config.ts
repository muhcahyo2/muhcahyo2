import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: 'blog/*.md',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                date: z.string(),
                author: z.string(),
                tags: z.array(z.string()),
                image: z.string().optional()
            })
        }),
        projects: defineCollection({
            type: 'page',
            source: 'projects/*.md',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                image: z.string().optional(),
                tech: z.array(z.string()),
                github: z.string().optional(),
                demo: z.string().optional(),
                featured: z.boolean().default(false),
                status: z.enum(['completed', 'in-progress', 'planned']).default('completed'),
                year: z.number().optional()
            })
        })
    }
})
