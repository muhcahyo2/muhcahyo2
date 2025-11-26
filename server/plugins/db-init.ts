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

  // Content index for AI knowledge base
  db.exec(`
    CREATE TABLE IF NOT EXISTS content_index (
      id INTEGER PRIMARY KEY,
      content_type TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      content_text TEXT NOT NULL,
      tags TEXT NOT NULL,
      metadata JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(content_type, slug)
    );
  `)

  // Indexes for performance
  db.exec('CREATE INDEX IF NOT EXISTS idx_profile_facts_category ON profile_facts (category);')
  db.exec('CREATE INDEX IF NOT EXISTS idx_conversations_session_id_created_at ON conversations (session_id, created_at);')
  db.exec('CREATE INDEX IF NOT EXISTS idx_content_index_type ON content_index (content_type);')
  db.exec('CREATE INDEX IF NOT EXISTS idx_content_index_search ON content_index (title, description, content_text);')

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

    // Index content for AI knowledge base
    console.log('Indexing website content for AI...')
    import('../utils/content-indexer').then(async ({ indexAllContent }) => {
      const result = await indexAllContent()
      if (result.success) {
        console.log(`✓ Indexed ${result.blogCount} blog posts and ${result.projectCount} projects`)
      } else {
        console.error('✗ Content indexing failed:', result.error)
      }
    }).catch(err => {
      console.error('✗ Failed to load content indexer:', err)
    })
  }
})
