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
        })
    }
})
