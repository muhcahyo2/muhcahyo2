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

// Mock DB
const mockPrepare = mock()
const mockRun = mock()
const mockAll = mock()
const mockDb = {
    prepare: mockPrepare
}
mockPrepare.mockReturnValue({
    run: mockRun,
    all: mockAll
})

mock.module('../../../server/utils/db', () => ({
    useDb: () => mockDb
}))

mock.module('../../../server/utils/ai/factory', () => ({
    useAI: mockUseAI
}))

// We don't mock ai-repository anymore, we let it use the mocked DB
// But we might want to spy on it?
// For now, we can verify DB calls or just trust that if DB is called, repo is working.
// Actually, let's mock context to avoid DB calls in enrichUserQuery if it uses DB directly?
// enrichUserQuery uses getConversationHistory and getProfileFacts.
// We can mock ContextBuilder.

const mockEnrichUserQuery = mock()
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
        mockPrepare.mockClear()
        mockRun.mockClear()
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

        // Verify DB was called to save user message
        // addMessage calls INSERT INTO conversations
        expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO conversations'))
        expect(mockRun).toHaveBeenCalledWith('123', 'user', 'hello', 0)

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
