import type { AIProvider, Message, ChatOptions, AIResponse, AIChunk } from '../types'

export class GeminiProvider implements AIProvider {
    private apiKey: string
    private model: string
    private baseUrl: string

    constructor(apiKey: string, model = 'gemini-1.5-pro', baseUrl = 'https://generativelanguage.googleapis.com/v1beta') {
        this.apiKey = apiKey
        this.model = model
        this.baseUrl = baseUrl
    }

    async chat(messages: Message[], options?: ChatOptions): Promise<AIResponse> {
        const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: this.formatMessages(messages, options?.systemPrompt),
                generationConfig: {
                    temperature: options?.temperature ?? 0.7,
                    maxOutputTokens: options?.maxTokens,
                }
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`)
        }

        const data = await response.json()
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

        return {
            content,
            usage: {
                promptTokens: data.usageMetadata?.promptTokenCount || 0,
                completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
                totalTokens: data.usageMetadata?.totalTokenCount || 0
            }
        }
    }

    async *streamChat(messages: Message[], options?: ChatOptions): AsyncIterable<AIChunk> {
        const url = `${this.baseUrl}/models/${this.model}:streamGenerateContent?key=${this.apiKey}&alt=sse`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: this.formatMessages(messages, options?.systemPrompt),
                generationConfig: {
                    temperature: options?.temperature ?? 0.7,
                    maxOutputTokens: options?.maxTokens,
                }
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('Response body is null')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.slice(6)
                    if (jsonStr === '[DONE]') continue // Gemini doesn't send [DONE] usually but just in case

                    try {
                        const data = JSON.parse(jsonStr)
                        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
                        if (content) {
                            yield { content, done: false }
                        }
                    } catch (e) {
                        // console.warn('Error parsing stream chunk', e)
                    }
                }
            }
        }

        yield { content: '', done: true }
    }

    private formatMessages(messages: Message[], systemPrompt?: string): any[] {
        const contents: any[] = []

        // Gemini supports system instructions separately in v1beta/models/gemini-1.5-pro-latest but 
        // for broad compatibility we'll prepend to first user message or use system_instruction if supported.
        // Let's use the standard contents array.
        // Note: Gemini roles are 'user' and 'model'.

        // If there is a system prompt, we can add it as a system_instruction field in the request body
        // BUT the current implementation of chat() puts everything in body.
        // For simplicity in this provider, we will prepend system prompt to the first user message
        // or send it as a user message if the first message isn't user.

        // Actually, let's try to use the system_instruction if we were using the latest API, 
        // but to be safe and simple, we'll prepend.

        let effectiveMessages = [...messages]

        if (systemPrompt) {
            // Prepend system prompt to the first message if it's a user message, 
            // or insert a user message with the system prompt.
            if (effectiveMessages.length > 0 && effectiveMessages[0].role === 'user') {
                effectiveMessages[0] = {
                    ...effectiveMessages[0],
                    content: `System Instruction: ${systemPrompt}\n\n${effectiveMessages[0].content}`
                }
            } else {
                effectiveMessages.unshift({ role: 'user', content: `System Instruction: ${systemPrompt}` })
            }
        }

        for (const msg of effectiveMessages) {
            // Map 'assistant' to 'model'
            const role = msg.role === 'assistant' ? 'model' : 'user'
            // Gemini doesn't like 'system' role in contents, we handled it above.
            if (msg.role === 'system') continue

            contents.push({
                role,
                parts: [{ text: msg.content }]
            })
        }

        return contents
    }
}
