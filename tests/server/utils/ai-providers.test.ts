import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { OpenAIProvider } from '../../../server/utils/ai/providers/openai'
import { GeminiProvider } from '../../../server/utils/ai/providers/gemini'

// Mock fetch
global.fetch = mock()

describe('AI Providers', () => {
    beforeEach(() => {
        (global.fetch as any).mockClear()
    })

    describe('OpenAIProvider', () => {
        it('should call OpenAI API correctly', async () => {
            const provider = new OpenAIProvider('test-key')
            const mockResponse = {
                choices: [{ message: { content: 'response' } }],
                usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
            }

                // Mock successful response
                ; (global.fetch as any).mockResolvedValue({
                    ok: true,
                    json: async () => mockResponse
                })

            const result = await provider.chat([{ role: 'user', content: 'hello' }])

            expect(result.content).toBe('response')
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.openai.com/v1/chat/completions',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer test-key'
                    })
                })
            )
        })
    })

    describe('GeminiProvider', () => {
        it('should call Gemini API correctly', async () => {
            const provider = new GeminiProvider('test-key')
            const mockResponse = {
                candidates: [{ content: { parts: [{ text: 'response' }] } }],
                usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, totalTokenCount: 15 }
            }

                ; (global.fetch as any).mockResolvedValue({
                    ok: true,
                    json: async () => mockResponse
                })

            const result = await provider.chat([{ role: 'user', content: 'hello' }])

            expect(result.content).toBe('response')
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'),
                expect.objectContaining({
                    method: 'POST'
                })
            )
        })
    })
})
