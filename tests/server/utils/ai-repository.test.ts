import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { getProfileFacts, addProfileFact, getConversationHistory, addMessage } from '../../../server/utils/ai-repository'

// Mock useDb
const mockPrepare = mock()
const mockExec = mock()
const mockTransaction = mock()

mock.module('../../../server/utils/db', () => ({
    useDb: () => ({
        prepare: mockPrepare,
        exec: mockExec,
        transaction: mockTransaction
    })
}))

describe('AI Repository', () => {
    beforeEach(() => {
        mockPrepare.mockClear()
        mockExec.mockClear()
        mockTransaction.mockClear()
    })

    describe('Profile Facts', () => {
        it('should get all profile facts', () => {
            const mockRows = [
                { id: 1, category: 'bio', key: 'summary', value: 'test', metadata: '{}' }
            ]
            // Mock the statement object returned by prepare
            const mockStmt = {
                all: mock().mockReturnValue(mockRows)
            }
            mockPrepare.mockReturnValue(mockStmt)

            const facts = getProfileFacts()

            expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM profile_facts')
            expect(facts).toHaveLength(1)
            expect(facts[0].category).toBe('bio')
        })

        it('should filter facts by category', () => {
            const mockStmt = {
                all: mock().mockReturnValue([])
            }
            mockPrepare.mockReturnValue(mockStmt)

            getProfileFacts('skills')

            expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM profile_facts WHERE category = ?')
        })

        it('should add a profile fact', () => {
            const mockRun = mock()
            const mockStmt = {
                run: mockRun
            }
            mockPrepare.mockReturnValue(mockStmt)

            addProfileFact('bio', 'test', 'value')

            expect(mockPrepare).toHaveBeenCalledWith(
                'INSERT INTO profile_facts (category, key, value, metadata) VALUES (?, ?, ?, ?)'
            )
            expect(mockRun).toHaveBeenCalled()
        })
    })

    describe('Conversations', () => {
        it('should get conversation history', () => {
            const mockRows = [
                { id: 1, session_id: '123', role: 'user', content: 'hi', created_at: '2023-01-01' }
            ]
            const mockStmt = {
                all: mock().mockReturnValue(mockRows)
            }
            mockPrepare.mockReturnValue(mockStmt)

            const history = getConversationHistory('123')

            expect(mockPrepare).toHaveBeenCalledWith(
                'SELECT * FROM conversations WHERE session_id = ? ORDER BY created_at DESC LIMIT ?'
            )
            expect(history).toHaveLength(1)
        })

        it('should add a message', () => {
            const mockRun = mock()
            const mockStmt = {
                run: mockRun
            }
            mockPrepare.mockReturnValue(mockStmt)

            addMessage('123', 'user', 'hello')

            expect(mockPrepare).toHaveBeenCalledWith(
                'INSERT INTO conversations (session_id, role, content, tokens_used) VALUES (?, ?, ?, ?)'
            )
            expect(mockRun).toHaveBeenCalledWith('123', 'user', 'hello', 0)
        })
    })
})
