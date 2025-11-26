import { getProfileFacts } from '../../../utils/ai-repository'
import { searchContentIndex } from '../../../utils/content-indexer'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { query } = body

    if (!query) {
        throw createError({ statusCode: 400, statusMessage: 'Query is required' })
    }

    // Search in profile facts
    const facts = getProfileFacts()
    const keywords = query.toLowerCase().split(' ').filter((k: string) => k.length > 2)

    const relevantFacts = facts.filter(f => {
        const text = (f.value + ' ' + f.key + ' ' + f.category).toLowerCase()
        return keywords.some((k: string) => text.includes(k))
    })

    // Search in website content (blogs and projects)
    const contentResults = searchContentIndex(query, 5)

    return {
        profile: {
            count: relevantFacts.length,
            results: relevantFacts.map(f => ({
                category: f.category,
                key: f.key,
                value: f.value
            }))
        },
        content: {
            count: contentResults.length,
            results: contentResults.map(c => ({
                type: c.content_type,
                slug: c.slug,
                title: c.title,
                description: c.description,
                tags: c.tags,
                excerpt: c.content_text.substring(0, 200) + '...'
            }))
        }
    }
})
