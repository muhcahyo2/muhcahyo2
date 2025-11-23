import { useDb } from './db'

export interface ProfileFact {
    id: number
    category: string
    key: string
    value: string
    metadata: any
    created_at: string
    updated_at: string
}

export interface ChatMessage {
    id: number
    session_id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    tokens_used: number
    created_at: string
}

// Profile Facts
export const getProfileFacts = (category?: string): ProfileFact[] => {
    const db = useDb()
    const stmt = category
        ? db.prepare('SELECT * FROM profile_facts WHERE category = ?')
        : db.prepare('SELECT * FROM profile_facts')

    const rows = category ? stmt.all(category) : stmt.all()

    return rows.map((row: any) => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : {}
    }))
}

export const addProfileFact = (category: string, key: string, value: string, metadata: any = {}) => {
    const db = useDb()
    return db.prepare(
        'INSERT INTO profile_facts (category, key, value, metadata) VALUES (?, ?, ?, ?)'
    ).run(category, key, value, JSON.stringify(metadata))
}

// Conversations
export const getConversationHistory = (sessionId: string, limit = 10): ChatMessage[] => {
    const db = useDb()
    // Get last N messages, then reverse to chronological order
    const rows = db.prepare(
        'SELECT * FROM conversations WHERE session_id = ? ORDER BY created_at DESC LIMIT ?'
    ).all(sessionId, limit)

    return rows.reverse() as ChatMessage[]
}

export const addMessage = (sessionId: string, role: string, content: string, tokensUsed = 0) => {
    const db = useDb()
    return db.prepare(
        'INSERT INTO conversations (session_id, role, content, tokens_used) VALUES (?, ?, ?, ?)'
    ).run(sessionId, role, content, tokensUsed)
}

// Config
export const getAiConfig = (key: string): string | null => {
    const db = useDb()
    const result = db.prepare('SELECT value FROM ai_config WHERE key = ?').get(key) as { value: string } | undefined
    return result ? result.value : null
}

export const setAiConfig = (key: string, value: string, description?: string) => {
    const db = useDb()
    return db.prepare(
        'INSERT INTO ai_config (key, value, description) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
    ).run(key, value, description)
}
