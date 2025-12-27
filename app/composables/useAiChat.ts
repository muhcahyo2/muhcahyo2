export interface ChatMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export const useAiChat = () => {
    const messages = useState<ChatMessage[]>('chat-messages', () => [])
    const isLoading = useState('chat-loading', () => false)
    const isLoadingHistory = useState('chat-history-loading', () => false)
    const error = useState<string | null>('chat-error', () => null)
    const hasMoreHistory = useState('chat-has-more-history', () => true)

    // Initialize session ID on client side only to avoid hydration mismatch
    const sessionId = useState<string>('chat-session-id', () => '')

    const fetchHistory = async (limit = 15) => {
        if (isLoadingHistory.value || !hasMoreHistory.value) return

        isLoadingHistory.value = true
        try {
            const offset = messages.value.length
            const response = await fetch(`/api/ai/chat/history?sessionId=${sessionId.value}&limit=${limit}&offset=${offset}`)
            if (!response.ok) throw new Error('Failed to fetch history')

            const history = await response.json()
            if (history.length < limit) {
                hasMoreHistory.value = false
            }

            // Prepend history to maintain chronological order
            messages.value.unshift(...history)
        } catch (e: any) {
            error.value = e.message
        } finally {
            isLoadingHistory.value = false
        }
    }

    onMounted(async () => {
        if (!sessionId.value) {
            sessionId.value = crypto.randomUUID()
        }
        if (messages.value.length === 0) {
            await fetchHistory()
        }
    })

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading.value) return

        isLoading.value = true
        error.value = null

        // Add user message immediately
        messages.value.push({ role: 'user', content })

        // Placeholder for assistant message
        const assistantMessageIndex = messages.value.push({ role: 'assistant', content: '' }) - 1

        // Typing effect configuration
        const typingDelay = 15 // milliseconds between each character
        let pendingText = ''
        let isTyping = false

        // Function to type out pending text character by character
        const typeNextChar = async () => {
            if (isTyping) return
            isTyping = true

            while (pendingText.length > 0) {
                const char = pendingText[0]
                pendingText = pendingText.slice(1)
                const msg = messages.value[assistantMessageIndex]
                if (msg) msg.content += char

                // Vary delay slightly for more natural feel
                const delay = char === ' ' ? typingDelay * 0.5 : typingDelay
                await new Promise(resolve => setTimeout(resolve, delay))
            }

            isTyping = false
        }

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content,
                    sessionId: sessionId.value
                })
            })

            if (!response.ok) throw new Error('Failed to send message')
            if (!response.body) throw new Error('No response body')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '[DONE]') break

                        try {
                            const parsed = JSON.parse(data)
                            if (parsed.content) {
                                // Add to pending text and start typing
                                pendingText += parsed.content
                                typeNextChar()
                            }
                            if (parsed.error) {
                                throw new Error(parsed.error)
                            }
                        } catch (e) {
                            console.error('Error parsing chunk', e)
                        }
                    }
                }
            }

            // Wait for remaining text to be typed out
            while (pendingText.length > 0 || isTyping) {
                await new Promise(resolve => setTimeout(resolve, 50))
            }
        } catch (e: any) {
            error.value = e.message
            const msg = messages.value[assistantMessageIndex]
            if (msg) msg.content += '\n\n[Error: ' + e.message + ']'
        } finally {
            isLoading.value = false
        }
    }


    const clearHistory = () => {
        messages.value = []
        hasMoreHistory.value = true
        sessionId.value = crypto.randomUUID()
    }

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearHistory,
        fetchHistory,
        isLoadingHistory,
        hasMoreHistory
    }
}
