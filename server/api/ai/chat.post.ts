import { ContextBuilder } from '../../utils/ai/context'
import { useAI } from '../../utils/ai/factory'
import { addMessage } from '../../utils/ai-repository'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { message, sessionId } = body

    if (!message || !sessionId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Message and sessionId are required'
        })
    }

    // Save user message
    addMessage(sessionId, 'user', message)

    const ai = useAI()
    // enrichUserQuery returns [System, ...History, User]
    const messages = await ContextBuilder.enrichUserQuery(message, sessionId)

    // Stream response
    // We don't pass systemPrompt in options because it's already in messages
    const stream = ai.streamChat(messages)

    // Set headers for SSE
    setResponseHeader(event, 'Content-Type', 'text/event-stream')
    setResponseHeader(event, 'Cache-Control', 'no-cache')
    setResponseHeader(event, 'Connection', 'keep-alive')

    const encoder = new TextEncoder()
    const responseStream = new ReadableStream({
        async start(controller) {
            let fullResponse = ''

            try {
                for await (const chunk of stream) {
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
                controller.close()
            }
        }
    })

    return sendStream(event, responseStream)
})
