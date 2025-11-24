# AI Web Profile Configuration

This document outlines the configuration options for the AI Web Profile feature.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# AI Provider Configuration
AI_PROVIDER=openai                    # Options: 'openai', 'anthropic', 'local'
AI_MODEL=gpt-4                        # Model name (provider-specific)

# API Keys (NEVER commit these values)
OPENAI_API_KEY=sk-...                 # OpenAI API key
ANTHROPIC_API_KEY=sk-ant-...          # Anthropic API key (optional)

# AI Behavior Configuration
AI_TEMPERATURE=0.7                     # Creativity level (0.0-1.0)
AI_MAX_TOKENS=500                      # Maximum response length
AI_TOP_P=0.9                          # Nucleus sampling parameter

# Rate Limiting
AI_RATE_LIMIT_REQUESTS_PER_MINUTE=10  # Max requests per session per minute
AI_RATE_LIMIT_TOKENS_PER_DAY=100000   # Daily token budget
AI_MAX_CONCURRENT_REQUESTS=3          # Maximum concurrent AI requests

# Performance
AI_STREAM_ENABLED=true                # Enable response streaming
AI_RESPONSE_TIMEOUT=10000             # Max response time in milliseconds
AI_CACHE_TTL=86400                    # Cache TTL in seconds (24 hours)

# Features
AI_CHAT_ENABLED=true                  # Enable/disable chat feature
AI_PROFILE_GENERATION_ENABLED=true    # Enable/disable dynamic profile sections
AI_CONVERSATION_HISTORY_ENABLED=true  # Enable/disable history persistence

# Data Retention
AI_CONVERSATION_RETENTION_DAYS=30     # How long to keep conversations

# Database
DATABASE_PATH=./.data/ai-profile.db   # SQLite database location

# Security
AI_INPUT_MAX_LENGTH=1000              # Maximum user input length
AI_ENABLE_CONTENT_FILTER=true         # Enable content moderation
```

## Runtime Configuration (nuxt.config.ts)

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    // Private (server-side only)
    ai: {
      provider: process.env.AI_PROVIDER || 'openai',
      model: process.env.AI_MODEL || 'gpt-4',
      apiKeys: {
        openai: process.env.OPENAI_API_KEY,
        anthropic: process.env.ANTHROPIC_API_KEY,
      },
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.AI_MAX_TOKENS || '500'),
      topP: parseFloat(process.env.AI_TOP_P || '0.9'),
      rateLimit: {
        requestsPerMinute: parseInt(process.env.AI_RATE_LIMIT_REQUESTS_PER_MINUTE || '10'),
        tokensPerDay: parseInt(process.env.AI_RATE_LIMIT_TOKENS_PER_DAY || '100000'),
        maxConcurrent: parseInt(process.env.AI_MAX_CONCURRENT_REQUESTS || '3'),
      },
      streaming: process.env.AI_STREAM_ENABLED !== 'false',
      timeout: parseInt(process.env.AI_RESPONSE_TIMEOUT || '10000'),
      cacheTTL: parseInt(process.env.AI_CACHE_TTL || '86400'),
      retention: parseInt(process.env.AI_CONVERSATION_RETENTION_DAYS || '30'),
      security: {
        inputMaxLength: parseInt(process.env.AI_INPUT_MAX_LENGTH || '1000'),
        contentFilterEnabled: process.env.AI_ENABLE_CONTENT_FILTER !== 'false',
      },
    },
    database: {
      path: process.env.DATABASE_PATH || './.data/ai-profile.db',
    },
    
    // Public (client-side accessible)
    public: {
      features: {
        aiChat: process.env.AI_CHAT_ENABLED !== 'false',
        aiProfileGeneration: process.env.AI_PROFILE_GENERATION_ENABLED !== 'false',
        conversationHistory: process.env.AI_CONVERSATION_HISTORY_ENABLED !== 'false',
      },
      ai: {
        streamingEnabled: process.env.AI_STREAM_ENABLED !== 'false',
        maxInputLength: parseInt(process.env.AI_INPUT_MAX_LENGTH || '1000'),
      },
    },
  },
  
  // Update modules if needed
  modules: ['@nuxt/content', '@nuxt/image', '@nuxtjs/tailwindcss'],
})
```

## Database Configuration

Initial database schema will be created automatically on first run. Optional seed data can be configured:

```typescript
// server/database/seed.ts
export const initialProfileFacts = [
  {
    category: 'bio',
    key: 'name',
    value: 'Your Name',
    metadata: { public: true },
  },
  {
    category: 'bio',
    key: 'profession',
    value: 'Software Developer',
    metadata: { public: true },
  },
  {
    category: 'bio',
    key: 'summary',
    value: 'A brief bio about yourself...',
    metadata: { public: true },
  },
  {
    category: 'skills',
    key: 'programming_languages',
    value: 'JavaScript, TypeScript, Python, Go',
    metadata: { proficiency: 'expert' },
  },
  {
    category: 'skills',
    key: 'frameworks',
    value: 'Vue.js, Nuxt, React, Node.js',
    metadata: { proficiency: 'expert' },
  },
  // Add more facts as needed
]

export const aiConfiguration = {
  personality_traits: [
    'professional but approachable',
    'technically knowledgeable',
    'concise and clear',
  ],
  tone: 'friendly-professional',
  response_style: 'informative with examples',
  prohibited_topics: ['politics', 'religion'],
  default_actions: {
    unknown_question: 'acknowledge_limitation',
    ambiguous_query: 'ask_clarification',
  },
}
```

## AI Provider-Specific Configuration

### OpenAI Configuration
```typescript
const openAIConfig = {
  model: 'gpt-4',              // or 'gpt-4-turbo', 'gpt-3.5-turbo'
  temperature: 0.7,
  maxTokens: 500,
  topP: 0.9,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  stream: true,
}
```

### Anthropic (Claude) Configuration
```typescript
const anthropicConfig = {
  model: 'claude-3-opus-20240229',  // or 'claude-3-sonnet', 'claude-3-haiku'
  temperature: 0.7,
  maxTokens: 500,
  topP: 0.9,
  stream: true,
}
```

### Local Model Configuration (Future)
```typescript
const localModelConfig = {
  endpoint: 'http://localhost:11434',  // Ollama or similar
  model: 'llama2',
  temperature: 0.7,
  maxTokens: 500,
}
```

## Prompt Template Configuration

Edit prompt templates in `server/ai/prompts/`:

### System Prompt Template (`system-prompt.txt`)
```
You are an AI assistant representing {profile_name}, a {profession}.

=== Background ===
{profile_bio}

=== Skills & Expertise ===
{profile_skills}

=== Recent Projects ===
{profile_projects}

=== Personality Guidelines ===
- Maintain a {tone} tone
- Be {personality_trait_1}
- Stay {personality_trait_2}
- Use first-person perspective when discussing {profile_name}'s experiences

=== Instructions ===
1. Answer questions about {profile_name}'s background, skills, and projects accurately
2. Use information from the knowledge base provided
3. If information is not available, politely acknowledge the limitation
4. Keep responses concise (under 200 words unless asked for details)
5. Provide specific examples when relevant
6. Never fabricate information not in the knowledge base

=== Restrictions ===
- Do not discuss: {prohibited_topics}
- Do not share: contact details unless explicitly in the knowledge base
- Do not engage in: off-topic conversations unrelated to the profile
```

### Chat Greeting Template
```
Hi! I'm an AI assistant that can answer questions about {profile_name}. 
I can tell you about their skills, experience, projects, and background. 
What would you like to know?
```

## Deployment Configuration Notes

### Production Checklist
- [ ] Set all environment variables in production environment
- [ ] Rotate and secure API keys
- [ ] Configure rate limiting based on expected traffic
- [ ] Set up monitoring and alerting for costs and errors
- [ ] Test failover and graceful degradation
- [ ] Configure CORS for API endpoints
- [ ] Set up SSL/TLS for secure communication
- [ ] Enable database backups
- [ ] Review and adjust token budgets
- [ ] Configure logging (avoid logging sensitive data)

### Cost Optimization
- Start with conservative token budgets
- Monitor actual usage for 1-2 weeks
- Adjust caching strategies based on cache hit rates
- Consider using cheaper models for simple queries
- Implement query classification to route to appropriate models

### Scaling Considerations
- SQLite is suitable for moderate traffic (< 1000 req/day)
- For higher traffic, consider PostgreSQL migration
- Implement Redis for distributed caching
- Use CDN for static AI-generated content
- Consider read replicas for conversation history

## Troubleshooting

### AI Not Responding
1. Check API key validity: `echo $OPENAI_API_KEY`
2. Verify provider is reachable: Test API endpoint
3. Check logs for authentication errors
4. Verify rate limits not exceeded

### Slow Responses
1. Check AI_RESPONSE_TIMEOUT setting
2. Reduce AI_MAX_TOKENS to decrease generation time
3. Enable streaming if disabled
4. Check network latency to AI provider
5. Review prompt length (shorter = faster)

### High Costs
1. Review token usage dashboard
2. Lower AI_RATE_LIMIT_TOKENS_PER_DAY
3. Increase cache TTL
4. Switch to cheaper model (e.g., gpt-3.5-turbo)
5. Implement more aggressive caching

### Database Errors
1. Check DATABASE_PATH is writable
2. Verify SQLite installation
3. Check disk space
4. Review database file permissions
5. Run database integrity check

## References

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Anthropic API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Nuxt Runtime Config](https://nuxt.com/docs/guide/going-further/runtime-config)
- [Better-SQLite3 Documentation](https://github.com/WiseLibs/better-sqlite3/wiki)
