import { getProfileFacts, getConversationHistory } from '../ai-repository'
import type { Message } from './types'

export class ContextBuilder {
    static buildSystemPrompt(facts: any[]): string {
        const bio = facts.find(f => f.category === 'bio' && f.key === 'summary')?.value || ''
        const skills = facts.filter(f => f.category === 'skills').map(f => `${f.key}: ${f.value}`).join('\n')
        const projects = facts.filter(f => f.category === 'projects').map(f => `${f.key}: ${f.value}`).join('\n')
        const experience = facts.filter(f => f.category === 'experience').map(f => `${f.key}: ${f.value}`).join('\n')

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

Instructions:
- Answer questions about the profile owner's background, skills, and projects
- Use first-person perspective ("I", "my") as if you are the profile owner
- Be concise but informative
- If you don't have information, admit it gracefully
- Maintain a professional and friendly tone
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
