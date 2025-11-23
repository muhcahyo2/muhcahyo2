import { ContextBuilder } from '../../../utils/ai/context'
import { useAI } from '../../../utils/ai/factory'
import { getProfileFacts } from '../../../utils/ai-repository'

export default defineEventHandler(async (event) => {
    const section = getRouterParam(event, 'section')

    if (!section) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Section parameter is required'
        })
    }

    const ai = useAI()
    const facts = getProfileFacts()

    // Build a specific prompt for the section
    const systemPrompt = ContextBuilder.buildSystemPrompt(facts)

    const prompt = `
Based on the profile facts, generate a professional "${section}" section for the website.
Format as Markdown.
Keep it engaging and relevant to a developer portfolio.
Do not include the heading, just the content.
`

    const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: prompt }
    ]

    try {
        const response = await ai.chat(messages)
        return { content: response.content }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to generate profile content: ${error.message}`
        })
    }
})
