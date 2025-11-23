import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

let _db: Database.Database | null = null

export const useDb = () => {
    if (_db) return _db

    const dbPath = join(process.cwd(), '.data', 'db.sqlite')
    mkdirSync(dirname(dbPath), { recursive: true })

    _db = new Database(dbPath)
    return _db
}
