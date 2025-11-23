import { getProfileFacts } from '../../../utils/ai-repository'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { query } = body

    if (!query) {
        throw createError({ statusCode: 400, statusMessage: 'Query is required' })
    }

    // Simple keyword search in facts for now
    const facts = getProfileFacts()
    const keywords = query.toLowerCase().split(' ').filter((k: string) => k.length > 2)

    const relevantFacts = facts.filter(f => {
        const text = (f.value + ' ' + f.key + ' ' + f.category).toLowerCase()
        return keywords.some((k: string) => text.includes(k))
    })

    return {
        count: relevantFacts.length,
        results: relevantFacts.map(f => ({
            category: f.category,
            key: f.key,
            value: f.value
        }))
    }
})
