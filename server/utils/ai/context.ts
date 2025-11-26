import { getProfileFacts, getConversationHistory } from '../ai-repository'
import { getContentByType } from '../content-indexer'
import type { Message } from './types'

export class ContextBuilder {
    static buildSystemPrompt(facts: any[]): string {
        const bio = facts.find(f => f.category === 'bio' && f.key === 'summary')?.value || ''
        const skills = facts.filter(f => f.category === 'skills').map(f => `${f.key}: ${f.value}`).join('\n')
        const projects = facts.filter(f => f.category === 'projects').map(f => `${f.key}: ${f.value}`).join('\n')
        const experience = facts.filter(f => f.category === 'experience').map(f => `${f.key}: ${f.value}`).join('\n')

        // Get website content for AI knowledge
        const blogPosts = getContentByType('blog')
        const projectsContent = getContentByType('project')

        const blogList = blogPosts.map(b => `- ${b.title}: ${b.description}`).join('\n')
        const projectsList = projectsContent.map(p => {
            const techList = Array.isArray(p.tags) ? p.tags.join(', ') : p.tags
            return `- ${p.title}: ${p.description} (Tech: ${techList})`
        }).join('\n')

        return `
You are an AI assistant representing the profile owner.

Background:
${bio}

Skills:
${skills}

Projects:
${projects}

Experience:
${experience}

Website Content - Blog Posts:
${blogList || 'No blog posts yet.'}

Website Content - Projects:
${projectsList || 'No projects yet.'}

Instructions:
- Answer questions about the profile owner's background, skills, projects, and blog posts
- Use first-person perspective ("I", "my") as if you are the profile owner
- When asked about blog posts or projects, reference the specific content from the website
- Be concise but informative
- If you don't have information, admit it gracefully
- Maintain a professional and friendly tone
- Format your responses using markdown for better readability:
  * Use **bold** for emphasis
  * Use \`code\` for technical terms, file names, or commands
  * Use code blocks with language tags for code examples (e.g., \`\`\`javascript)
  * Use lists (- or 1.) for multiple items
  * Use headings (##, ###) to structure longer responses
  * Use links [text](url) when referencing external resources
`
    }

    static async enrichUserQuery(query: string, sessionId: string): Promise<Message[]> {
        const history = getConversationHistory(sessionId)

        // Convert history to AI Message format
        // Note: history is already in chronological order from getConversationHistory
        const historyMessages: Message[] = history.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content
        }))

        return [
            ...historyMessages,
            { role: 'user', content: query }
        ]
    }
}
