# AI Web Profile Features

This project integrates AI capabilities to create an intelligent, interactive personal website.

## Features

### 1. AI Chat Assistant
A floating chat widget allows visitors to ask questions about the profile owner.
- **Context-Aware**: The AI knows about your bio, skills, projects, and experience.
- **Streaming Responses**: Real-time typing effect for a natural feel.
- **Conversation History**: Remembers context within the session.

### 2. Dynamic Profile Content
Profile sections (Bio, Skills, Projects, Experience) can be dynamically generated or enhanced by AI.
- **Endpoint**: `/api/ai/profile/:section`
- **Caching**: Responses can be cached for performance.

### 3. Knowledge Base
The system uses a structured database of "facts" about the profile owner to ground AI responses.
- **Storage**: SQLite database (`.data/db.sqlite`)
- **Management**: Facts are stored in the `profile_facts` table.

## Configuration

### Environment Variables
Configure the AI provider in your `.env` file:

```env
# Provider Selection (openai, gemini, anthropic, local)
AI_PROVIDER=gemini

# API Keys
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=sk-...

# Models
GEMINI_MODEL=gemini-1.5-pro
```

### Database
The SQLite database is automatically created at `.data/db.sqlite` on first run.
Initial seed data is populated if the `profile_facts` table is empty.

To modify profile data, you can edit the database directly or use the future admin interface.

## Architecture

- **Frontend**: Vue 3 components (`AiChatWidget`, `AiProfileSection`)
- **Backend**: Nuxt 4 server routes (`/api/ai/*`)
- **AI Layer**: Provider abstraction supporting multiple LLMs
- **Data**: `better-sqlite3` for local persistence

## Data Privacy

- **Conversation Logs**: User messages and AI responses are stored locally in the `conversations` table for history and debugging.
- **No External Training**: Your data is sent to the AI provider (OpenAI/Google) for inference only, subject to their API terms.
- **Sensitive Data**: Do not store sensitive personal information in the `profile_facts` table.
