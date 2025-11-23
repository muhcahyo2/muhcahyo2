export default defineNitroPlugin(() => {
    const db = useDb()

    // Profile knowledge base
    db.exec(`
    CREATE TABLE IF NOT EXISTS profile_facts (
      id INTEGER PRIMARY KEY,
      category TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      metadata JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

    // Conversation history
    db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      tokens_used INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

    // AI configuration
    db.exec(`
    CREATE TABLE IF NOT EXISTS ai_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

    // Seed data
    const factCount = db.prepare('SELECT COUNT(*) as count FROM profile_facts').get() as { count: number }
    if (factCount.count === 0) {
        console.log('Seeding profile facts...')
        const insert = db.prepare('INSERT INTO profile_facts (category, key, value, metadata) VALUES (?, ?, ?, ?)')
        const facts = [
            ['bio', 'summary', 'I am a passionate developer building intelligent web applications.', '{}'],
            ['skills', 'languages', 'TypeScript, JavaScript, Python, SQL', '{}'],
            ['skills', 'frameworks', 'Nuxt 3, Vue 3, React, TailwindCSS', '{}'],
            ['experience', 'current_role', 'Senior Frontend Engineer', '{}'],
            ['projects', 'personal_web', 'This website is a personal portfolio with AI capabilities.', '{}']
        ]

        const transaction = db.transaction((data) => {
            for (const row of data) insert.run(row)
        })
        transaction(facts)
    }
})
