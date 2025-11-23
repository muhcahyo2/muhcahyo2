export interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export interface ChatOptions {
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
}

export interface AIResponse {
    content: string
    usage?: {
        promptTokens: number
        completionTokens: number
        totalTokens: number
    }
}

export interface AIChunk {
    content: string
    done: boolean
}

export interface AIProvider {
    chat(messages: Message[], options?: ChatOptions): Promise<AIResponse>
    streamChat(messages: Message[], options?: ChatOptions): AsyncIterable<AIChunk>
}
