# Project Context

## Purpose
A Web Profile with AI-based features.
[User specific: AI integration for dynamic content/interaction]

## Tech Stack
- **Framework**: Nuxt 4
- **Core**: Vue 3, TypeScript
- **Package Manager**: Bun
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Key Modules**:
  - `@nuxt/content` (v3.8.2) - Content management
  - `@nuxt/image` (v2.0.0) - Image optimization
  - `@nuxtjs/tailwindcss`
- **Database**: `better-sqlite3`

## Project Conventions

### Code Style
- **Script**: Use `<script setup lang="ts">` (Composition API).
- **Styling**: Tailwind CSS (Utility-first).
- **Formatting**: Follow standard Prettier/ESLint rules for Vue/TS.
- **Naming**: PascalCase for components, camelCase for functions/variables.

### Architecture Patterns
- **Nuxt 4 Structure**: Application code resides in the `app/` directory (or root if configured).
- **Routing**: File-based routing (Nuxt default).
- **State Management**: `useState` (Nuxt built-in) or Pinia (if added).

### Testing Strategy
- **Unit/Component Testing**: Vitest
- **E2E**: [To be determined]

### Git Workflow
- Standard Feature Branch Workflow.

## Domain Context
Personal website / Portfolio.

## Important Constraints
- **Compatibility**: `compatibilityDate: '2025-07-15'` set in config.
- **Performance**: Utilize `@nuxt/image` for asset optimization.

## External Dependencies
- None currently configured.
