# Markdown Rendering Testing Guide

This document provides test cases to verify markdown rendering functionality in the AI chat widget.

## Test Cases

### 1. Headings (h1-h6)

**Test Input:**
```
Can you show me different heading levels?

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

**Expected Result:**
- Each heading should render with appropriate size and weight
- Headings should have proper spacing

### 2. Text Formatting

**Test Input:**
```
Show me text formatting:
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
```

**Expected Result:**
- Bold text should be bold
- Italic text should be italicized
- Combined formatting should work
- Strikethrough should have line through text

### 3. Lists

**Test Input:**
```
Show me lists:

Unordered list:
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

Ordered list:
1. First item
2. Second item
3. Third item
```

**Expected Result:**
- Unordered lists should have bullet points
- Ordered lists should have numbers
- Nested lists should be indented
- Proper spacing between items

### 4. Inline Code

**Test Input:**
```
Use the `useState` hook in React or run `npm install` command.
```

**Expected Result:**
- Inline code should have distinct background color
- Monospace font
- Slight padding and rounded corners

### 5. Code Blocks

**Test Input:**
````
Here's a JavaScript example:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return true;
}
```

And a Python example:

```python
def greet(name):
    print(f"Hello, {name}!")
    return True
```
````

**Expected Result:**
- Code blocks should have dark background
- Syntax highlighting should be applied
- Language-specific colors for keywords, strings, etc.
- Proper padding and scrolling if needed

### 6. Links

**Test Input:**
```
Check out [Google](https://google.com) or [GitHub](https://github.com)
```

**Expected Result:**
- Links should be colored (indigo)
- Hover effect (underline)
- Links should be clickable and open in new tab

### 7. Blockquotes

**Test Input:**
```
> This is a blockquote
> It can span multiple lines
> And should be visually distinct
```

**Expected Result:**
- Left border (vertical line)
- Italic text
- Distinct background or color
- Proper padding

### 8. Tables

**Test Input:**
```
| Feature | Status | Priority |
|---------|--------|----------|
| Markdown | Done | High |
| Syntax Highlighting | Done | High |
| Tables | Testing | Medium |
```

**Expected Result:**
- Table with borders
- Header row with distinct background
- Proper cell padding
- Aligned content

### 9. Mixed Content

**Test Input:**
```
# Project Overview

Here's what I've built:

## Features
- **Authentication**: Using JWT tokens
- **Database**: PostgreSQL with `better-sqlite3`
- **Frontend**: Vue 3 + Nuxt

## Code Example

```typescript
const config = {
  api: 'https://api.example.com',
  timeout: 5000
}
```

> Note: This is still in development

For more info, visit [the docs](https://example.com)
```

**Expected Result:**
- All elements should render correctly together
- Proper spacing between different elements
- No layout issues or overlapping

### 10. XSS Prevention

**Test Input:**
```
<script>alert('XSS')</script>
<img src=x onerror="alert('XSS')">
<a href="javascript:alert('XSS')">Click me</a>
```

**Expected Result:**
- Script tags should be sanitized/removed
- No JavaScript execution
- Content should be safe
- May render as plain text or be stripped

### 11. Edge Cases

**Test Input:**
```
Empty message:


Multiple line breaks:



Malformed markdown:
**bold without closing

Code without closing:
```javascript
const x = 1;

Very long code line:
```javascript
const veryLongVariableName = "This is a very long string that should trigger horizontal scrolling in the code block to test overflow handling";
```
```

**Expected Result:**
- Empty messages should not break layout
- Multiple line breaks should be handled gracefully
- Malformed markdown should render reasonably
- Long lines should scroll horizontally

## Manual Testing Checklist

- [ ] Test on desktop browser
- [ ] Test on mobile browser
- [ ] Test in dark mode (if applicable)
- [ ] Test with long messages
- [ ] Test rapid message sending
- [ ] Test copy-paste from rendered markdown
- [ ] Verify no console errors
- [ ] Check performance with multiple messages

## Automated Testing (Future)

Consider adding:
- Unit tests for `useMarkdown` composable
- Snapshot tests for rendered output
- E2E tests for chat interactions
