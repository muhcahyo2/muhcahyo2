# Quick Start Guide - AI Web Profile Implementation

This guide provides a fast-track path to implementing the AI Web Profile feature based on the approved OpenSpec proposal.

## Prerequisites

Before you begin, ensure you have:
- [x] Node.js 18+ and Bun installed
- [x] This Nuxt project set up and running
- [x] OpenAI or Anthropic API account (choose one)
- [x] Basic understanding of Vue 3 and Nuxt 4

## Step 1: Get AI Provider API Key

### Option A: OpenAI (Recommended for beginners)
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Create an account or sign in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-proj-...`)
6. Add billing information and set a budget limit

### Option B: Anthropic (Claude)
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys
4. Generate a new key
5. Copy the key (starts with `sk-ant-...`)

## Step 2: Configure Environment

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your API key:**
   ```bash
   # For OpenAI
   AI_PROVIDER=openai
   AI_MODEL=gpt-4
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   
   # Or for Anthropic
   # AI_PROVIDER=anthropic
   # AI_MODEL=claude-3-sonnet-20240229
   # ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   ```

3. **Adjust other settings as needed** (optional for now)

## Step 3: Install Dependencies

The AI feature will require additional packages. Based on your provider choice:

### For OpenAI:
```bash
bun add openai
```

### For Anthropic:
```bash
bun add @anthropic-ai/sdk
```

### Common dependencies:
```bash
# For rate limiting
bun add express-rate-limit

# For caching (optional but recommended)
bun add node-cache
```

## Step 4: Create Database Structure

1. **Create data directory:**
   ```bash
   mkdir -p .data
   ```

2. **The database will be created automatically** on first run by the initialization script (to be implemented in Phase 1)

## Step 5: Implementation Phases

Follow the tasks in **chronological order** as defined in `tasks.md`:

### 🚀 Phase 1: Foundation (Week 1)
**Goal:** Get basic AI chat working

1. **Database Layer** (Days 1-2)
   - [ ] Create `server/database/schema.ts` with table definitions
   - [ ] Create `server/database/init.ts` for initialization
   - [ ] Create `server/database/profile.ts` for CRUD operations
   - [ ] Test database operations

2. **AI Service** (Days 3-4)
   - [ ] Create `server/ai/types.ts` with interfaces
   - [ ] Create `server/ai/providers/openai.ts` (or anthropic)
   - [ ] Create `server/ai/factory.ts` for provider selection
   - [ ] Test AI provider connection

3. **Basic API** (Day 5)
   - [ ] Create `server/api/ai/chat.post.ts`
   - [ ] Implement request validation
   - [ ] Add basic error handling
   - [ ] Test with curl or Postman

4. **Minimal UI** (Days 6-7)
   - [ ] Create `app/components/ai/AiChatWidget.vue`
   - [ ] Add to `app.vue` or create new page
   - [ ] Test end-to-end chat flow

**Milestone 1:** ✅ Can send a message and get AI response

### ⚡ Phase 2: Core Features (Week 2)
**Goal:** Add history, streaming, and smart context

1. **Conversation History** (Days 8-9)
   - [ ] Implement history storage in database
   - [ ] Add history retrieval to chat API
   - [ ] Display history in UI

2. **Streaming** (Day 10)
   - [ ] Modify API to support streaming
   - [ ] Update frontend to handle SSE/streams
   - [ ] Test real-time display

3. **Context & Prompts** (Days 11-12)
   - [ ] Create `server/ai/context-builder.ts`
   - [ ] Design system prompt template
   - [ ] Implement fact injection
   - [ ] Test context relevance

4. **Rate Limiting** (Days 13-14)
   - [ ] Add rate limiting middleware
   - [ ] Implement token tracking
   - [ ] Add budget alerts

**Milestone 2:** ✅ Fully functional conversational AI with history

### 🎨 Phase 3: Polish (Week 3)
**Goal:** Production-ready with caching, monitoring, and docs

1. **Caching** (Days 15-16)
   - [ ] Implement response caching
   - [ ] Add cache invalidation logic

2. **Error Handling** (Day 17)
   - [ ] Comprehensive error boundaries
   - [ ] Graceful degradation
   - [ ] User-friendly error messages

3. **Admin & Config** (Days 18-19)
   - [ ] Create admin page for config
   - [ ] Add analytics dashboard
   - [ ] Implement configuration UI

4. **Testing & Docs** (Days 20-21)
   - [ ] Write unit tests
   - [ ] Write integration tests
   - [ ] Update documentation
   - [ ] Performance testing

**Milestone 3:** ✅ Production-ready AI Web Profile

## Step 6: Testing Checklist

Before deploying, verify:
- [ ] Chat widget displays correctly on desktop and mobile
- [ ] AI responses are accurate and relevant
- [ ] Conversation history persists across sessions
- [ ] Rate limiting prevents abuse
- [ ] Error states display user-friendly messages
- [ ] Response times are under 3 seconds
- [ ] Cost monitoring is working
- [ ] All sensitive data is in `.env` (not committed)

## Step 7: Deployment

1. **Environment Setup:**
   ```bash
   # On your production server/platform
   # Set all environment variables from .env
   ```

2. **Build:**
   ```bash
   bun run build
   ```

3. **Database:**
   ```bash
   # Ensure .data directory exists and is writable
   mkdir -p .data
   ```

4. **Start:**
   ```bash
   bun run preview
   # or your production start command
   ```

5. **Monitor:**
   - Watch API costs in your AI provider dashboard
   - Monitor response times
   - Check error rates
   - Review conversation quality

## Common Issues & Solutions

### Issue: "API key not found"
**Solution:** Check that `.env` file exists and `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is set correctly.

### Issue: "Too many requests"
**Solution:** Rate limit hit. Wait 1 minute or adjust `AI_RATE_LIMIT_REQUESTS_PER_MINUTE` in `.env`.

### Issue: "Slow responses"
**Solution:** 
- Reduce `AI_MAX_TOKENS` in `.env`
- Enable streaming: `AI_STREAM_ENABLED=true`
- Use faster model: `AI_MODEL=gpt-3.5-turbo` (OpenAI) or `claude-3-haiku` (Anthropic)

### Issue: "High API costs"
**Solution:**
- Lower `AI_RATE_LIMIT_TOKENS_PER_DAY`
- Increase `AI_CACHE_TTL`
- Use cheaper model
- Implement more aggressive caching

### Issue: "Database locked"
**Solution:** SQLite doesn't handle high concurrency well. For production with high traffic:
- Reduce `AI_MAX_CONCURRENT_REQUESTS`
- Or migrate to PostgreSQL (future enhancement)

## Next Steps After Implementation

1. **Gather Feedback:**
   - Monitor which questions users ask most
   - Track satisfaction (add thumbs up/down)
   - Analyze conversation flows

2. **Iterate:**
   - Refine system prompts based on response quality
   - Add more profile facts to knowledge base
   - Optimize caching based on hit rates

3. **Enhance:**
   - Add voice input (future)
   - Implement advanced RAG with embeddings
   - Add multi-modal support (images)
   - Fine-tune custom model

4. **Scale:**
   - Migrate to PostgreSQL if needed
   - Add Redis for distributed caching
   - Implement CDN for static content
   - Consider edge functions for global latency

## Resources

- **Proposal Docs:** `openspec/changes/add-ai-web-profile-core/`
- **Implementation Tasks:** `openspec/changes/add-ai-web-profile-core/tasks.md`
- **Technical Design:** `openspec/changes/add-ai-web-profile-core/design.md`
- **Configuration Guide:** `openspec/changes/add-ai-web-profile-core/config.md`

## Support

For questions or issues:
1. Review the design.md for architectural decisions
2. Check config.md for configuration options
3. Consult tasks.md for implementation details
4. Review OpenSpec guidelines in `openspec/AGENTS.md`

---

**Ready to start?** Begin with Phase 1, Task 1.1: Create database schema! 🚀
