import { describe, it, expect, mock, beforeEach } from 'bun:test'

// Mock Nuxt/H3 globals
global.defineEventHandler = (handler: any) => handler
global.readBody = mock()
global.createError = (err: any) => err
global.setResponseHeader = mock()
global.sendStream = mock()

// Mock dependencies
const mockStreamChat = mock()
const mockUseAI = mock().mockReturnValue({
    streamChat: mockStreamChat
})
const mockAddMessage = mock()
const mockEnrichUserQuery = mock()

mock.module('../../../server/utils/ai/factory', () => ({
    useAI: mockUseAI
}))

mock.module('../../../server/utils/ai-repository', () => ({
    addMessage: mockAddMessage,
    getProfileFacts: mock()
}))

mock.module('../../../server/utils/ai/context', () => ({
    ContextBuilder: {
        enrichUserQuery: mockEnrichUserQuery
    }
}))

describe('Chat API Endpoint', () => {
    let handler: any

    beforeEach(async () => {
        mockUseAI.mockClear()
        mockStreamChat.mockClear()
        mockAddMessage.mockClear()
        mockEnrichUserQuery.mockClear()
            ; (global.readBody as any).mockClear()
            ; (global.setResponseHeader as any).mockClear()
            ; (global.sendStream as any).mockClear()

        // Re-import to ensure mocks are applied
        handler = (await import('../../../server/api/ai/chat.post')).default
    })

    it('should handle valid chat request', async () => {
        const mockEvent = {}
        const mockBody = { message: 'hello', sessionId: '123' }
        const mockMessages = [{ role: 'user', content: 'hello' }]

            ; (global.readBody as any).mockResolvedValue(mockBody)
        mockEnrichUserQuery.mockResolvedValue(mockMessages)

        // Mock stream
        const mockAsyncIterator = {
            async *[Symbol.asyncIterator]() {
                yield { content: 'response', done: false }
            }
        }
        mockStreamChat.mockReturnValue(mockAsyncIterator)

        await handler(mockEvent)

        expect(global.readBody).toHaveBeenCalledWith(mockEvent)
        expect(mockAddMessage).toHaveBeenCalledWith('123', 'user', 'hello')
        expect(mockEnrichUserQuery).toHaveBeenCalledWith('hello', '123')
        expect(mockStreamChat).toHaveBeenCalledWith(mockMessages)
        expect(global.setResponseHeader).toHaveBeenCalledWith(mockEvent, 'Content-Type', 'text/event-stream')
        expect(global.sendStream).toHaveBeenCalled()
    })

    it('should throw error if message is missing', async () => {
        const mockEvent = {}
            ; (global.readBody as any).mockResolvedValue({ sessionId: '123' })

        try {
            await handler(mockEvent)
            expect(true).toBe(false) // Should not reach here
        } catch (e: any) {
            expect(e.statusCode).toBe(400)
        }
    })
})
