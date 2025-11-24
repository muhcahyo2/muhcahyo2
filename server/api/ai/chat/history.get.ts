import { getConversationHistory } from '../../../utils/ai-repository'

export default defineEventHandler((event) => {
    const { sessionId, limit = '10', offset = '0' } = getQuery(event)

    if (!sessionId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'sessionId is required'
        })
    }

    const limitNum = parseInt(limit as string, 10)
    const offsetNum = parseInt(offset as string, 10)

    if (isNaN(limitNum) || isNaN(offsetNum)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'limit and offset must be numbers'
        })
    }

    return getConversationHistory(sessionId as string, limitNum, offsetNum)
})
