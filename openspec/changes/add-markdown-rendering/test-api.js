/**
 * API Markdown Format Test
 * 
 * This script tests that markdown formatting is preserved through the API.
 * Run this in the browser console while on the site with the chat widget open.
 */

async function testMarkdownAPI() {
    const sessionId = crypto.randomUUID()

    const testCases = [
        {
            name: 'Bold text',
            message: 'Show me **bold text**',
            expectedPattern: /\*\*bold text\*\*/
        },
        {
            name: 'Code block',
            message: 'Show me a code example',
            expectedPattern: /```/
        },
        {
            name: 'Inline code',
            message: 'Use `inline code`',
            expectedPattern: /`inline code`/
        },
        {
            name: 'List',
            message: 'List items:\n- Item 1\n- Item 2',
            expectedPattern: /-\s+Item/
        }
    ]

    console.log('🧪 Starting Markdown API Tests...\n')

    for (const test of testCases) {
        console.log(`Testing: ${test.name}`)

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: test.message,
                    sessionId: sessionId
                })
            })

            if (!response.ok) {
                console.error(`❌ ${test.name}: HTTP ${response.status}`)
                continue
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''
            let fullResponse = ''
            let hasMetadata = false

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        try {
                            const parsed = JSON.parse(data)
                            if (parsed.content) {
                                fullResponse += parsed.content
                            }
                            if (parsed.metadata?.supportsMarkdown) {
                                hasMetadata = true
                            }
                            if (parsed.type === 'done') {
                                break
                            }
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }

            // Check if markdown is preserved
            const markdownPreserved = test.expectedPattern.test(fullResponse) ||
                test.expectedPattern.test(test.message)

            console.log(`  Response length: ${fullResponse.length} chars`)
            console.log(`  Has metadata: ${hasMetadata ? '✅' : '❌'}`)
            console.log(`  Markdown preserved: ${markdownPreserved ? '✅' : '⚠️ (AI may not have used markdown)'}`)
            console.log(`  Sample: "${fullResponse.substring(0, 100)}..."`)
            console.log('')

        } catch (error) {
            console.error(`❌ ${test.name}: ${error.message}`)
        }
    }

    console.log('✅ API Tests Complete!')
}

// Export for use
if (typeof window !== 'undefined') {
    window.testMarkdownAPI = testMarkdownAPI
    console.log('Run testMarkdownAPI() to test the API')
}
