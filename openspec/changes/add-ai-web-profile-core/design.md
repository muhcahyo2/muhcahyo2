# AI Web Profile - Technical Design

## Context
The AI Web Profile feature transforms a static personal website into an intelligent, interactive platform. This is a cross-cutting change affecting multiple layers (database, API, frontend) and introduces external AI service dependencies. The design must balance functionality, performance, cost, and user experience.

**Constraints:**
- Must work within Nuxt 4 + Vue 3 architecture
- Use existing `better-sqlite3` for persistence
- Integrate with `@nuxt/content` for knowledge management
- Support multiple AI providers for flexibility
- Maintain fast response times (< 3s target)

**Stakeholders:**
- Profile owner (control over AI behavior and data)
- Visitors (seamless, helpful interactions)
- Future: potential API consumers

## Goals / Non-Goals

**Goals:**
- Enable natural language interaction with profile content
- Provide accurate, contextual responses about the profile owner
- Maintain conversation context across multiple turns
- Support multiple AI provider backends (OpenAI, Anthropic, local models)
- Ensure data privacy and control
- Create reusable AI infrastructure for future features

**Non-Goals:**
- Real-time voice/video interaction (text-only initially)
- Multi-user chat or social features
- Training custom ML models (use existing LLM APIs)
- Complex RAG (Retrieval-Augmented Generation) with vector databases initially
- Multi-language support in v1 (English only)

## Architecture

### System Overview

```
┌─────────────────┐
│   Vue Frontend  │ (Chat UI, Profile Sections)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Nuxt API Layer │ (/api/ai/*)
└────────┬────────┘
         │
         ├──→ ┌──────────────┐
         │    │  AI Service  │ (Provider Abstraction)
         │    └──────┬───────┘
         │           │
         │           ├──→ OpenAI API
         │           ├──→ Anthropic API
         │           └──→ Local Model (future)
         │
         └──→ ┌──────────────┐
              │   Database   │ (SQLite)
              └──────────────┘
              - Profile Facts
              - Conversations
              - Knowledge Base
```

### Component Breakdown

#### 1. Database Schema
```sql
-- Profile knowledge base
CREATE TABLE profile_facts (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL,  -- 'bio', 'skills', 'projects', 'experience'
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Conversation history
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,  -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI configuration
CREATE TABLE ai_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. AI Service Layer
```typescript
// services/ai/types.ts
interface AIProvider {
  chat(messages: Message[], options?: ChatOptions): Promise<AIResponse>
  streamChat(messages: Message[], options?: ChatOptions): AsyncIterable<AIChunk>
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatOptions {
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

// services/ai/factory.ts
class AIProviderFactory {
  static create(provider: 'openai' | 'anthropic' | 'local'): AIProvider
}

// services/ai/context-builder.ts
class ContextBuilder {
  buildSystemPrompt(facts: ProfileFact[]): string
  enrichUserQuery(query: string, history: Message[]): Message[]
}
```

#### 3. API Endpoints
- `POST /api/ai/chat` - Main conversational endpoint
- `GET /api/ai/profile/:section` - Generate dynamic profile content
- `POST /api/ai/knowledge/query` - Knowledge base queries
- `GET /api/ai/config` - Get AI configuration (admin)
- `PUT /api/ai/config` - Update AI configuration (admin)

#### 4. Frontend Components
```
app/components/ai/
├── AiChatWidget.vue         # Main chat interface
├── AiChatMessage.vue        # Individual message display
├── AiChatInput.vue          # User input field
├── AiProfileSection.vue     # Dynamic profile content
├── AiThinkingIndicator.vue  # Loading state
└── AiErrorBoundary.vue      # Error handling
```

## Decisions

### Decision 1: AI Provider Abstraction
**Choice:** Create a unified interface supporting multiple AI providers (OpenAI, Anthropic, local models)

**Rationale:**
- Flexibility to switch providers based on cost, performance, or availability
- Future-proofing against API changes or vendor lock-in
- Allows A/B testing different models
- Enables fallback mechanisms

**Alternatives Considered:**
- Hard-coded OpenAI integration: Simpler initially but creates vendor lock-in
- Multi-model ensemble: Too complex for v1, potential future enhancement

**Implementation:**
```typescript
// services/ai/providers/openai.ts
export class OpenAIProvider implements AIProvider { ... }

// services/ai/providers/anthropic.ts
export class AnthropicProvider implements AIProvider { ... }

// Usage
const ai = AIProviderFactory.create(useRuntimeConfig().ai.provider)
```

### Decision 2: Context Management Strategy
**Choice:** Use SQLite-based conversation history + in-memory context window

**Rationale:**
- SQLite already in tech stack (no new dependencies)
- Fast local queries for conversation retrieval
- Simple backup and data export
- Supports offline development and testing

**Context Window Strategy:**
- Keep last N messages in memory (default: 10)
- Summarize older conversations for long-running sessions
- Store full history in DB for analytics and debugging

**Alternatives Considered:**
- Redis/in-memory only: Lose conversation history on restart
- Vector database (Pinecone, Weaviate): Overkill for v1, complex setup
- Browser localStorage only: Security concerns, limited capacity

### Decision 3: Prompt Engineering Approach
**Choice:** Template-based system prompts with dynamic fact injection

**Template Structure:**
```typescript
const systemPrompt = `
You are an AI assistant representing {profile_name}, a {profession}.

Background:
{profile_bio}

Skills & Expertise:
{profile_skills}

Recent Projects:
{profile_projects}

Personality Guidelines:
- {personality_trait_1}
- {personality_trait_2}

Instructions:
- Answer questions about {profile_name}'s background, skills, and projects
- Use first-person perspective when appropriate
- Be concise but informative
- If you don't have information, admit it gracefully
- Maintain a {tone} tone
`
```

**Rationale:**
- Easy to customize without code changes
- Version control for prompt changes
- A/B testable
- Clear separation of concerns

### Decision 4: Streaming vs Batch Responses
**Choice:** Implement both, default to streaming for chat

**Rationale:**
- Streaming: Better UX, perceived performance, allows early cancellation
- Batch: Simpler for profile content generation, better for caching

**Usage Guidelines:**
- Chat interface: Use streaming for real-time feel
- Profile sections: Use batch for simpler caching
- API: Support both via query parameter

### Decision 5: Rate Limiting & Cost Control
**Choice:** Multi-layer rate limiting

**Layers:**
1. Client-side: Debouncing (500ms), disable during processing
2. API layer: Rate limiting per session (10 req/min)
3. Database: Track token usage per day
4. Circuit breaker: Pause if daily budget exceeded

**Rationale:**
- Prevents API cost runaway
- Protects against abuse
- Maintains good UX under normal usage

**Configuration:**
```typescript
const rateLimits = {
  requestsPerMinute: 10,
  tokensPerDay: 100000,
  maxConcurrentRequests: 3,
  budgetAlertThreshold: 80 // % of daily limit
}
```

## Data Flow Examples

### Scenario 1: User asks about skills
```
1. User types: "What programming languages do you know?"
   ↓
2. Frontend sends POST /api/ai/chat
   Body: { message: "...", sessionId: "abc123" }
   ↓
3. API handler:
   - Retrieves last 10 messages from DB
   - Fetches profile_facts WHERE category='skills'
   - Builds context with ContextBuilder
   ↓
4. AI Service:
   - Constructs full prompt with system + conversation + facts
   - Calls AI provider API
   - Streams response chunks
   ↓
5. API streams response to frontend
   ↓
6. Frontend displays message in real-time
   ↓
7. Background: Save both messages to conversations table
```

### Scenario 2: Generate profile section
```
1. Page loads, needs "About" section
   ↓
2. Frontend calls GET /api/ai/profile/about
   ↓
3. API handler:
   - Checks cache (Redis/memory)
   - If miss: Fetch facts, generate with AI
   - Returns markdown/HTML
   ↓
4. Frontend renders with @nuxt/content
```

## Risks / Trade-offs

### Risk 1: AI API Costs
**Impact:** High usage could lead to unexpected expenses
**Mitigation:**
- Implement strict rate limiting
- Add daily budget caps with alerts
- Cache common queries aggressively
- Provide cost dashboard for monitoring
- Consider local model fallback for simple queries

### Risk 2: Response Quality & Hallucinations
**Impact:** AI might provide incorrect or fabricated information
**Mitigation:**
- Curate high-quality profile facts in database
- Use strict system prompts with grounding instructions
- Implement fact-checking layer for critical information
- Add disclaimer to UI about AI nature
- Allow profile owner to review and flag incorrect responses

### Risk 3: Latency
**Impact:** Slow AI responses degrade UX
**Mitigation:**
- Use streaming for immediate feedback
- Optimize prompt length (fewer tokens = faster)
- Implement aggressive caching
- Add timeout handling (max 10s)
- Show engaging loading states

### Risk 4: Data Privacy
**Impact:** Sensitive information might be logged or exposed
**Mitigation:**
- Clear data retention policies
- Option to disable conversation logging
- Sanitize prompts before sending to AI
- Use environment variables for sensitive config
- Add admin controls for data export/deletion

### Trade-off: Accuracy vs Speed
- **Fast + Simple:** Small context window, cached responses, simple prompts
- **Accurate + Rich:** Large context, RAG, complex prompts, higher costs
- **Selected Balance:** Medium context (10 messages), selective fact injection, smart caching

### Trade-off: Features vs Complexity
- **V1 Scope:** Text chat, basic profile generation, single provider
- **Future:** Voice, images, multi-modal, advanced RAG, fine-tuned models
- **Decision:** Ship lean v1, iterate based on usage data

## Migration Plan

### Phase 1: Foundation (Week 1)
1. Set up database schema
2. Seed initial profile facts
3. Configure AI provider (start with OpenAI)
4. Build basic API endpoints
5. Create minimal chat UI

### Phase 2: Core Features (Week 2)
1. Implement conversation history
2. Add streaming support
3. Build context management
4. Create profile section generation
5. Add rate limiting

### Phase 3: Polish (Week 3)
1. Implement caching
2. Add comprehensive error handling
3. Build admin configuration UI
4. Performance optimization
5. Testing and documentation

### Rollback Plan
If critical issues arise:
1. Disable AI features via feature flag
2. Show static profile content
3. Maintain database (don't drop tables)
4. Investigate and fix issues
5. Re-enable with fixes

**Feature Flag:**
```typescript
const AI_ENABLED = useRuntimeConfig().public.features.aiProfile ?? false
```

## Open Questions

1. **AI Provider Selection:** Start with OpenAI (GPT-4) or Anthropic (Claude)? 
   - **Recommendation:** OpenAI for broader compatibility, easier testing
   
2. **Conversation Retention:** How long to keep chat history?
   - **Proposal:** 30 days with configurable retention period
   
3. **Authentication:** Should chat be authenticated or public?
   - **Proposal:** Public for visitors, authenticated admin panel for configuration
   
4. **Analytics:** What metrics to track?
   - **Proposal:** Questions asked, response times, token usage, user satisfaction (optional thumbs up/down)
   
5. **Content Moderation:** Need input/output filtering?
   - **Proposal:** Basic profanity filter, content policy compliance check

## Performance Targets

- **Response Time (P95):** < 3 seconds
- **Streaming First Chunk:** < 500ms
- **Cache Hit Rate:** > 40% for common queries
- **Uptime:** > 99% (graceful degradation if AI unavailable)
- **Cost per 1000 queries:** < $1 (optimize prompt size)

## Security Considerations

1. **API Key Management:** Store in environment variables, never commit
2. **Input Sanitization:** Validate and sanitize all user inputs
3. **Output Filtering:** Check for sensitive data leakage
4. **Rate Limiting:** Prevent abuse and DDoS
5. **CORS:** Proper configuration for API endpoints
6. **Data Encryption:** Encrypt conversation history at rest (future enhancement)
