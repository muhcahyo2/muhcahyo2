export interface BlogPost {
    title: string
    description: string
    date: string
    author: string
    tags: string[]
    image?: string
    _path: string
}

/**
 * Find related blog posts based on shared tags
 * @param currentPost - The current blog post
 * @param allPosts - All available blog posts
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts sorted by relevance
 */
export function findRelatedPosts(
    currentPost: BlogPost,
    allPosts: BlogPost[],
    limit: number = 3
): BlogPost[] {
    if (!currentPost || !allPosts || allPosts.length === 0) {
        return []
    }

    // Filter out the current post
    const otherPosts = allPosts.filter(post => post._path !== currentPost._path)

    // Calculate similarity score for each post
    const postsWithScores = otherPosts.map(post => {
        let score = 0

        // Count shared tags
        const sharedTags = post.tags.filter(tag =>
            currentPost.tags.includes(tag)
        )
        score += sharedTags.length * 10

        // Bonus for recent posts (within 30 days)
        const daysDiff = Math.abs(
            new Date(currentPost.date).getTime() - new Date(post.date).getTime()
        ) / (1000 * 60 * 60 * 24)

        if (daysDiff <= 30) {
            score += 5
        } else if (daysDiff <= 90) {
            score += 2
        }

        return { post, score }
    })

    // Sort by score (descending) and return top N
    return postsWithScores
        .filter(item => item.score > 0) // Only include posts with some relevance
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.post)
}

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (default: 'id-ID')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale: string = 'id-ID'): string {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Calculate reading time for a blog post
 * @param content - The blog post content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
}
