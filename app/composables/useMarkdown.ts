import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'

export const useMarkdown = () => {
    // Configure marked
    const renderer = new marked.Renderer()

    renderer.code = ({ text, lang }: { text: string, lang?: string }) => {
        const validLanguage = lang && hljs.getLanguage(lang)

        let highlighted
        try {
            highlighted = validLanguage
                ? hljs.highlight(text, { language: lang }).value
                : hljs.highlightAuto(text).value
        } catch (e) {
            highlighted = text // Fallback
        }

        return `<pre><code class="hljs ${lang || ''}">${highlighted}</code></pre>`
    }

    marked.use({
        renderer,
        breaks: true,
        gfm: true
    })

    const render = (content: string) => {
        if (!content) return ''

        try {
            const rawHtml = marked.parse(content) as string

            // DOMPurify needs a window context in some environments, but usually works in browser
            // For SSR safety, we might want to check process.client or use a wrapper
            // But for now, let's assume standard usage.
            return DOMPurify.sanitize(rawHtml, {
                ADD_TAGS: ['pre', 'code', 'span'],
                ADD_ATTR: ['class'],
            })
        } catch (e) {
            console.error('Markdown rendering error:', e)
            return content
        }
    }

    return {
        render
    }
}
