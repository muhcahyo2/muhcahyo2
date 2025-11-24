import { describe, it, expect, mock, beforeEach } from 'bun:test'

// Mock useDb
const mockPrepare = mock()
const mockRun = mock()
const mockAll = mock()
const mockGet = mock()

mockPrepare.mockReturnValue({
    run: mockRun,
    all: mockAll,
    get: mockGet
})

const mockDb = {
    prepare: mockPrepare
}

// Mock the module
mock.module('../../../server/utils/db', () => ({
    useDb: () => mockDb
}))

import {
    getProfileFacts,
    addProfileFact,
    getConversationHistory,
    addMessage,
    getAiConfig,
    setAiConfig
} from '../../../server/utils/ai-repository'

describe('AI Repository', () => {
    beforeEach(() => {
        mockPrepare.mockClear()
        mockRun.mockClear()
        mockAll.mockClear()
        mockGet.mockClear()
    })

    describe('Profile Facts', () => {
        it('should get all profile facts', () => {
            const mockRows = [
                { category: 'bio', key: 'summary', value: 'test', metadata: '{}' }
            ]
            mockAll.mockReturnValue(mockRows)

            const facts = getProfileFacts()

            expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM profile_facts')
            expect(facts).toEqual([{ ...mockRows[0], metadata: {} }])
        })

        it('should get profile facts by category', () => {
            const mockRows = [
                { category: 'bio', key: 'summary', value: 'test', metadata: '{}' }
            ]
            mockAll.mockReturnValue(mockRows)

            const facts = getProfileFacts('bio')

            expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM profile_facts WHERE category = ?')
            expect(mockAll).toHaveBeenCalledWith('bio')
            expect(facts).toEqual([{ ...mockRows[0], metadata: {} }])
        })

        it('should add profile fact', () => {
            addProfileFact('bio', 'test', 'value', { foo: 'bar' })

            expect(mockPrepare).toHaveBeenCalledWith(
                'INSERT INTO profile_facts (category, key, value, metadata) VALUES (?, ?, ?, ?)'
            )
            expect(mockRun).toHaveBeenCalledWith('bio', 'test', 'value', '{"foo":"bar"}')
        })
    })

    describe('Conversations', () => {
        it('should get conversation history', () => {
            const mockRows = [
                { id: 2, content: 'world', created_at: '2023-01-02' },
                { id: 1, content: 'hello', created_at: '2023-01-01' }
            ]
            mockAll.mockReturnValue(mockRows)

            const history = getConversationHistory('session1')

            expect(mockPrepare).toHaveBeenCalledWith(
                'SELECT * FROM conversations WHERE session_id = ? ORDER BY created_at DESC LIMIT ?'
            )
            expect(mockAll).toHaveBeenCalledWith('session1', 10)
            // Should reverse the rows
            expect(history).toEqual(mockRows.reverse() as any)
        })

        it('should add message', () => {
            addMessage('session1', 'user', 'hello', 10)

            expect(mockPrepare).toHaveBeenCalledWith(
                'INSERT INTO conversations (session_id, role, content, tokens_used) VALUES (?, ?, ?, ?)'
            )
            expect(mockRun).toHaveBeenCalledWith('session1', 'user', 'hello', 10)
        })
    })

    describe('Config', () => {
        it('should get config', () => {
            mockGet.mockReturnValue({ value: 'some-value' })

            const value = getAiConfig('some-key')

            expect(mockPrepare).toHaveBeenCalledWith('SELECT value FROM ai_config WHERE key = ?')
            expect(mockGet).toHaveBeenCalledWith('some-key')
            expect(value).toBe('some-value')
        })

        it('should return null if config not found', () => {
            mockGet.mockReturnValue(undefined)

            const value = getAiConfig('missing')

            expect(value).toBeNull()
        })

        it('should set config', () => {
            setAiConfig('key', 'value', 'desc')

            expect(mockPrepare).toHaveBeenCalledWith(
                'INSERT INTO ai_config (key, value, description) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
            )
            expect(mockRun).toHaveBeenCalledWith('key', 'value', 'desc')
        })
    })
})
