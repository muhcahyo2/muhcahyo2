import { ContextBuilder } from '../../utils/ai/context'
import { useAI } from '../../utils/ai/factory'
import { addMessage } from '../../utils/ai-repository'
import { isRateLimited } from '../../utils/rate-limit'
import { getProfileFacts } from '../../utils/ai-repository'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { message, sessionId } = body

    if (!message || !sessionId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Message and sessionId are required'
        })
    }

    // Rate limiting (10 requests per minute per session)
    if (isRateLimited(sessionId, { limit: 10, windowMs: 60000 })) {
        throw createError({
            statusCode: 429,
            statusMessage: 'Too many requests. Please try again later.'
        })
    }

    // Save user message
    addMessage(sessionId, 'user', message)

    const ai = useAI()
    // enrichUserQuery returns [System, ...History, User]
    const messages = await ContextBuilder.enrichUserQuery(message, sessionId)

    console.log('System prompt:', getProfileFacts())
    const systemPrompt = ContextBuilder.buildSystemPrompt(getProfileFacts())

    // Stream response
    // We don't pass systemPrompt in options because it's already in messages
    const stream = ai.streamChat(messages, { systemPrompt })

    // Set headers for SSE
    setResponseHeader(event, 'Content-Type', 'text/event-stream')
    setResponseHeader(event, 'Cache-Control', 'no-cache')
    setResponseHeader(event, 'Connection', 'keep-alive')

    const encoder = new TextEncoder()
    const responseStream = new ReadableStream({
        async start(controller) {
            const streamStart = performance.now()
            let fullResponse = ''
            let timeToFirstToken = 0

            try {
                for await (const chunk of stream) {
                    if (timeToFirstToken === 0) {
                        timeToFirstToken = performance.now() - streamStart
                    }
                    if (chunk.content) {
                        fullResponse += chunk.content
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk.content })}\n\n`))
                    }
                }
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))

                // Save assistant message after completion
                addMessage(sessionId, 'assistant', fullResponse)
            } catch (error: any) {
                console.error('Stream error:', error)
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`))
            } finally {
                const streamEnd = performance.now()
                const duration = (streamEnd - streamStart).toFixed(2)
                console.log(`[Perf] AI stream took ${duration}ms (TTFT: ${timeToFirstToken.toFixed(2)}ms)`)
                controller.close()
            }
        }
    })

    return sendStream(event, responseStream)
})
