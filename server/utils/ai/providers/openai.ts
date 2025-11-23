import type { AIProvider, Message, ChatOptions, AIResponse, AIChunk } from '../types'

export class OpenAIProvider implements AIProvider {
    private apiKey: string
    private baseUrl: string

    constructor(apiKey: string, baseUrl = 'https://api.openai.com/v1') {
        this.apiKey = apiKey
        this.baseUrl = baseUrl
    }

    async chat(messages: Message[], options?: ChatOptions): Promise<AIResponse> {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: this.prepareMessages(messages, options?.systemPrompt),
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens,
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`)
        }

        const data = await response.json()
        return {
            content: data.choices[0].message.content,
            usage: {
                promptTokens: data.usage.prompt_tokens,
                completionTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens
            }
        }
    }

    async *streamChat(messages: Message[], options?: ChatOptions): AsyncIterable<AIChunk> {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: this.prepareMessages(messages, options?.systemPrompt),
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens,
                stream: true
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`)
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
                if (line.trim() === '') continue
                if (line.trim() === 'data: [DONE]') return

                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6))
                        const content = data.choices[0]?.delta?.content || ''
                        if (content) {
                            yield { content, done: false }
                        }
                    } catch (e) {
                        console.warn('Error parsing stream chunk', e)
                    }
                }
            }
        }

        yield { content: '', done: true }
    }

    private prepareMessages(messages: Message[], systemPrompt?: string): Message[] {
        if (!systemPrompt) return messages
        return [
            { role: 'system', content: systemPrompt },
            ...messages
        ]
    }
}
