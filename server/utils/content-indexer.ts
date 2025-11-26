import { useDb } from './db'

export interface ContentIndex {
    id: number
    content_type: 'blog' | 'project'
    slug: string
    title: string
    description: string
    content_text: string
    tags: string
    metadata: any
    created_at: string
    updated_at: string
}

/**
 * Index all blog posts and projects for AI knowledge base
 */
export async function indexAllContent() {
    try {
        console.log('Starting content indexing...')

        // Import Nuxt Content utilities
        const { queryCollection } = await import('#content/server')

        // Clear existing content index
        const db = useDb()
        db.prepare('DELETE FROM content_index').run()

        // Index blog posts
        const blogPosts = await queryCollection('blog').all()
        console.log(`Indexing ${blogPosts.length} blog posts...`)

        for (const post of blogPosts) {
            indexBlogPost(post)
        }

        // Index projects
        const projects = await queryCollection('projects').all()
        console.log(`Indexing ${projects.length} projects...`)

        for (const project of projects) {
            indexProject(project)
        }

        console.log('Content indexing completed!')
        return { success: true, blogCount: blogPosts.length, projectCount: projects.length }
    } catch (error) {
        console.error('Error indexing content:', error)
        return { success: false, error: String(error) }
    }
}

/**
 * Index a single blog post
 */
export function indexBlogPost(post: any) {
    const db = useDb()

    // Extract text content from markdown body
    const contentText = extractTextFromMarkdown(post.body?.children || [])

    const stmt = db.prepare(`
        INSERT INTO content_index (content_type, slug, title, description, content_text, tags, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(content_type, slug) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            content_text = excluded.content_text,
            tags = excluded.tags,
            metadata = excluded.metadata,
            updated_at = CURRENT_TIMESTAMP
    `)

    stmt.run(
        'blog',
        post._path || '',
        post.title || '',
        post.description || '',
        contentText,
        JSON.stringify(post.tags || []),
        JSON.stringify({
            author: post.author,
            date: post.date,
            image: post.image
        })
    )
}

/**
 * Index a single project
 */
export function indexProject(project: any) {
    const db = useDb()

    // Extract text content from markdown body
    const contentText = extractTextFromMarkdown(project.body?.children || [])

    const stmt = db.prepare(`
        INSERT INTO content_index (content_type, slug, title, description, content_text, tags, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(content_type, slug) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            content_text = excluded.content_text,
            tags = excluded.tags,
            metadata = excluded.metadata,
            updated_at = CURRENT_TIMESTAMP
    `)

    stmt.run(
        'project',
        project._path || '',
        project.title || '',
        project.description || '',
        contentText,
        JSON.stringify(project.tech || []),
        JSON.stringify({
            github: project.github,
            demo: project.demo,
            status: project.status,
            year: project.year,
            featured: project.featured
        })
    )
}

/**
 * Extract plain text from markdown AST
 */
function extractTextFromMarkdown(nodes: any[]): string {
    let text = ''

    for (const node of nodes) {
        if (node.type === 'text') {
            text += node.value + ' '
        } else if (node.type === 'code') {
            // Include code blocks as they might be relevant
            text += node.value + ' '
        } else if (node.children) {
            text += extractTextFromMarkdown(node.children)
        }
    }

    return text.trim()
}

/**
 * Search content index for AI knowledge queries
 */
export function searchContentIndex(query: string, limit: number = 5): ContentIndex[] {
    const db = useDb()
    const keywords = query.toLowerCase().split(' ').filter(k => k.length > 2)

    if (keywords.length === 0) {
        return []
    }

    // Build search query with OR conditions for each keyword
    const conditions = keywords.map(() => `
        (LOWER(title) LIKE ? OR 
         LOWER(description) LIKE ? OR 
         LOWER(content_text) LIKE ? OR
         LOWER(tags) LIKE ?)
    `).join(' OR ')

    const params = keywords.flatMap(keyword => {
        const pattern = `%${keyword}%`
        return [pattern, pattern, pattern, pattern]
    })

    const stmt = db.prepare(`
        SELECT * FROM content_index
        WHERE ${conditions}
        ORDER BY updated_at DESC
        LIMIT ?
    `)

    const results = stmt.all(...params, limit) as any[]

    return results.map(row => ({
        ...row,
        tags: JSON.parse(row.tags || '[]'),
        metadata: JSON.parse(row.metadata || '{}')
    }))
}

/**
 * Get content by type
 */
export function getContentByType(type: 'blog' | 'project'): ContentIndex[] {
    const db = useDb()
    const stmt = db.prepare('SELECT * FROM content_index WHERE content_type = ? ORDER BY updated_at DESC')
    const results = stmt.all(type) as any[]

    return results.map(row => ({
        ...row,
        tags: JSON.parse(row.tags || '[]'),
        metadata: JSON.parse(row.metadata || '{}')
    }))
}
