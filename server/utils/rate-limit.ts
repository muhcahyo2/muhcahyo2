interface RateLimitConfig {
    limit: number
    windowMs: number
}

const limits = new Map<string, { count: number, resetTime: number }>()

export const isRateLimited = (key: string, config: RateLimitConfig = { limit: 10, windowMs: 60000 }): boolean => {
    const now = Date.now()
    const record = limits.get(key)

    if (!record || now > record.resetTime) {
        limits.set(key, { count: 1, resetTime: now + config.windowMs })
        return false
    }

    if (record.count >= config.limit) {
        return true
    }

    record.count++
    return false
}
