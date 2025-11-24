import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { GeminiProvider } from '../../../../server/utils/ai/providers/gemini'
import { OpenAIProvider } from '../../../../server/utils/ai/providers/openai'

// Mock fetch
const mockFetch = mock()
global.fetch = mockFetch

describe('AI Providers', () => {
    beforeEach(() => {
        mockFetch.mockClear()
    })

    describe('GeminiProvider', () => {
        const provider = new GeminiProvider('fake-key')

        it('should call generateContent endpoint for chat', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    candidates: [{
                        content: { parts: [{ text: 'Gemini response' }] }
                    }],
                    usageMetadata: {
                        promptTokenCount: 10,
                        candidatesTokenCount: 20,
                        totalTokenCount: 30
                    }
                })
            })

            const response = await provider.chat([{ role: 'user', content: 'hello' }])

            expect(mockFetch).toHaveBeenCalledTimes(1)
            expect(mockFetch.mock.calls[0][0]).toContain('generateContent')
            expect(response.content).toBe('Gemini response')
            expect(response.usage).toEqual({
                promptTokens: 10,
                completionTokens: 20,
                totalTokens: 30
            })
        })

        it('should handle API errors', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                statusText: 'Bad Request',
                json: async () => ({ error: { message: 'Invalid key' } })
            })

            try {
                await provider.chat([{ role: 'user', content: 'hello' }])
                expect(true).toBe(false) // Should not reach here
            } catch (e: any) {
                expect(e.message).toContain('Gemini API Error: Invalid key')
            }
        })
    })

    describe('OpenAIProvider', () => {
        const provider = new OpenAIProvider('fake-key')

        it('should call chat/completions endpoint for chat', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    choices: [{
                        message: { content: 'OpenAI response' }
                    }],
                    usage: {
                        prompt_tokens: 10,
                        completion_tokens: 20,
                        total_tokens: 30
                    }
                })
            })

            const response = await provider.chat([{ role: 'user', content: 'hello' }])

            expect(mockFetch).toHaveBeenCalledTimes(1)
            expect(mockFetch.mock.calls[0][0]).toContain('chat/completions')
            expect(response.content).toBe('OpenAI response')
            expect(response.usage).toEqual({
                promptTokens: 10,
                completionTokens: 20,
                totalTokens: 30
            })
        })
    })
})
