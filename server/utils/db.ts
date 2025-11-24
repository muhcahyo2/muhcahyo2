import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

let _db: Database.Database | null = null

const createProxy = (db: Database.Database): Database.Database => {
    return new Proxy(db, {
        get(target, prop, receiver) {
            const original = Reflect.get(target, prop, receiver)

            if (prop === 'prepare' && typeof original === 'function') {
                return (...args: any[]) => {
                    const stmt = original.apply(target, args)
                    return new Proxy(stmt, {
                        get(stmtTarget, stmtProp, stmtReceiver) {
                            const stmtOriginal = Reflect.get(stmtTarget, stmtProp, stmtReceiver)
                            if (typeof stmtOriginal === 'function' && ['run', 'get', 'all'].includes(stmtProp as string)) {
                                return (...stmtArgs: any[]) => {
                                    const start = performance.now()
                                    const result = stmtOriginal.apply(stmtTarget, stmtArgs)
                                    const end = performance.now()
                                    console.log(`[Perf] DB Query (${(args[0] as string).substring(0, 30)}...) took ${(end - start).toFixed(2)}ms`)
                                    return result
                                }
                            }
                            return stmtOriginal
                        }
                    })
                }
            }

            if (prop === 'exec' && typeof original === 'function') {
                return (...args: any[]) => {
                    const start = performance.now()
                    const result = original.apply(target, args)
                    const end = performance.now()
                    console.log(`[Perf] DB Exec took ${(end - start).toFixed(2)}ms`)
                    return result
                }
            }
            
            if (prop === 'transaction' && typeof original === 'function') {
                return (...args: any[]) => {
                    const fn = args[0]
                    const wrappedFn = (...txArgs: any[]) => {
                        const start = performance.now()
                        const result = fn(...txArgs)
                        const end = performance.now()
                        console.log(`[Perf] DB Transaction took ${(end - start).toFixed(2)}ms`)
                        return result
                    }
                    return original.apply(target, [wrappedFn, ...args.slice(1)])
                }
            }

            return original
        }
    })
}


export const useDb = () => {
    if (_db) return _db

    const dbPath = join(process.cwd(), '.data', 'db.sqlite')
    mkdirSync(dirname(dbPath), { recursive: true })

    const db = new Database(dbPath)
    
    // Use proxy only in development to avoid overhead
    if (process.env.NODE_ENV === 'development') {
        _db = createProxy(db)
    } else {
        _db = db
    }
    
    return _db
}
