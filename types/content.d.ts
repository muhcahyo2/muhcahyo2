// Type declarations for @nuxt/content virtual server module
declare module '#content/server' {
    import type { QueryCollectionParams, QueryCollectionResult } from '@nuxt/content'

    /**
     * Query a content collection from the server-side
     */
    export function queryCollection<T = any>(
        collection: string,
        params?: QueryCollectionParams
    ): {
        all(): Promise<T[]>
        first(): Promise<T | null>
        find(): Promise<T[]>
    }

    /**
     * Get parsed content by path
     */
    export function getContent<T = any>(path: string): Promise<T | null>
}
