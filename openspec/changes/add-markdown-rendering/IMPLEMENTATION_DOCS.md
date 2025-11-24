# Markdown Rendering Implementation

## Overview

This feature adds markdown rendering capability to AI chat responses, allowing for rich formatted content including code blocks with syntax highlighting, lists, headings, links, and more.

## Architecture

### Components

1. **`useMarkdown` Composable** (`app/composables/useMarkdown.ts`)
   - Handles markdown parsing and HTML sanitization
   - Uses `marked` for markdown parsing
   - Uses `DOMPurify` for XSS prevention
   - Uses `highlight.js` for syntax highlighting

2. **Chat Widget** (`app/components/ai/AiChatWidget.vue`)
   - Renders user messages as plain text
   - Renders AI messages as markdown HTML
   - Applies markdown-specific CSS classes

3. **Styles** (`app/assets/css/main.css`)
   - Custom CSS for markdown elements
   - Syntax highlighting theme (Atom One Dark)
   - Responsive and dark-mode compatible

### Dependencies

- **marked** (v17.0.1): Markdown parser
- **dompurify** (v3.3.0): HTML sanitizer for XSS prevention
- **highlight.js** (v11.11.1): Syntax highlighting
- **@types/marked**: TypeScript types
- **@types/dompurify**: TypeScript types

## Implementation Details

### Markdown Parsing

```typescript
const renderer = new marked.Renderer()

renderer.code = ({ text, lang }: { text: string, lang?: string }) => {
  const validLanguage = lang && hljs.getLanguage(lang)
  
  let highlighted
  try {
    highlighted = validLanguage 
      ? hljs.highlight(text, { language: lang }).value 
      : hljs.highlightAuto(text).value
  } catch (e) {
    highlighted = text // Fallback
  }

  return `<pre><code class="hljs ${lang || ''}">${highlighted}</code></pre>`
}

marked.use({ 
  renderer,
  breaks: true,  // Convert line breaks to <br>
  gfm: true      // GitHub Flavored Markdown
})
```

### Security (XSS Prevention)

DOMPurify sanitizes the HTML output to prevent XSS attacks:

```typescript
return DOMPurify.sanitize(rawHtml, {
  ADD_TAGS: ['pre', 'code', 'span'],
  ADD_ATTR: ['class'],
})
```

This configuration:
- Allows only safe HTML tags
- Strips out `<script>` tags and event handlers
- Preserves necessary tags for code highlighting

### Rendering in Vue

```vue
<div 
  v-if="msg.role === 'user'"
  class="whitespace-pre-wrap"
>{{ msg.content }}</div>
<div 
  v-else
  class="markdown-content"
  v-html="render(msg.content)"
></div>
```

User messages are rendered as plain text, while AI messages are rendered as HTML.

## Supported Markdown Features

### Text Formatting
- **Bold**: `**text**` or `__text__`
- *Italic*: `*text*` or `_text_`
- ~~Strikethrough~~: `~~text~~`

### Headings
```markdown
# H1
## H2
### H3
#### H4
```

### Lists
```markdown
- Unordered list
  - Nested item

1. Ordered list
2. Second item
```

### Code
- Inline: `` `code` ``
- Block:
  ````markdown
  ```javascript
  const x = 1;
  ```
  ````

### Links
```markdown
[Link text](https://example.com)
```

### Blockquotes
```markdown
> Quote text
```

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## Styling

### Syntax Highlighting Theme
- **Theme**: Atom One Dark
- **File**: `highlight.js/styles/atom-one-dark.css`
- Dark background with vibrant syntax colors

### Custom Markdown Styles
All markdown elements have custom styles under `.markdown-content` class:
- Headings with appropriate sizes
- Lists with proper indentation
- Code blocks with dark background
- Inline code with pink accent
- Links with indigo color
- Responsive and mobile-friendly

## AI System Prompt Updates

The system prompt now includes instructions to use markdown:

```
- Format your responses using markdown for better readability:
  * Use **bold** for emphasis
  * Use `code` for technical terms, file names, or commands
  * Use code blocks with language tags for code examples
  * Use lists for multiple items
  * Use headings to structure longer responses
  * Use links when referencing external resources
```

## Testing

See `TESTING_GUIDE.md` for comprehensive test cases.

### Quick Test
Ask the AI: "Can you show me a code example in JavaScript?"

Expected response should include:
- Markdown formatted text
- Syntax highlighted code block
- Proper styling

## Performance Considerations

1. **Client-side rendering**: Markdown is parsed on the client
2. **Caching**: Consider memoizing rendered content for repeated messages
3. **Large messages**: Long code blocks have horizontal scrolling

## Security Considerations

1. **XSS Prevention**: DOMPurify sanitizes all HTML
2. **Safe defaults**: Only whitelisted tags and attributes allowed
3. **No inline scripts**: All script tags and event handlers removed

## Future Enhancements

1. **LaTeX/Math support**: Add KaTeX for mathematical formulas
2. **Mermaid diagrams**: Support for diagram rendering
3. **Copy button**: Add copy-to-clipboard for code blocks
4. **Theme switching**: Allow users to choose syntax highlighting theme
5. **Performance**: Memoize rendered content to avoid re-parsing

## Troubleshooting

### Markdown not rendering
- Check browser console for errors
- Verify `useMarkdown` is imported correctly
- Ensure CSS is loaded

### Syntax highlighting not working
- Verify highlight.js CSS is imported in `nuxt.config.ts`
- Check if language is supported by highlight.js
- Try using `hljs.highlightAuto()` for auto-detection

### XSS concerns
- DOMPurify is configured to strip dangerous content
- Test with `<script>alert('test')</script>` - should not execute
- Review DOMPurify configuration if custom tags needed
