import { OpenAIProvider } from './providers/openai'
import { GeminiProvider } from './providers/gemini'
import type { AIProvider } from './types'

export class AIProviderFactory {
    static create(provider: string, config: any): AIProvider {
        switch (provider) {
            case 'openai':
                if (!config.openaiApiKey) {
                    console.warn('OpenAI API key is missing. AI features may not work.')
                }
                return new OpenAIProvider(config.openaiApiKey || '')

            case 'gemini':
                if (!config.geminiApiKey) {
                    console.warn('Gemini API key is missing. AI features may not work.')
                }
                return new GeminiProvider(config.geminiApiKey || '', config.geminiModel)

            // Future providers
            // case 'anthropic': return new AnthropicProvider(config.anthropicApiKey)
            // case 'local': return new LocalProvider(config.localModelEndpoint)

            default:
                throw new Error(`Unknown AI provider: ${provider}`)
        }
    }
}

export const useAI = () => {
    const config = useRuntimeConfig()
    return AIProviderFactory.create(config.ai.provider, config.ai)
}
