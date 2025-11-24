# Manual Testing Checklist

Use this checklist to systematically test all markdown rendering features.

## Setup
- [ ] Open the website in a browser
- [ ] Open the AI chat widget
- [ ] Have browser DevTools console open to check for errors

---

## 5.1 Test Headings (h1-h6)

### Test Prompt
```
Can you show me different heading levels?

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

### Expected Result
- [ ] H1 renders with largest size (text-xl)
- [ ] H2 renders with large size (text-lg)
- [ ] H3 renders with base size (text-base)
- [ ] H4 renders properly
- [ ] All headings are bold
- [ ] Proper spacing above and below headings
- [ ] Dark mode: headings are visible (white/gray-100)

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## 5.2 Test Lists

### Test Prompt (Unordered)
```
Show me an unordered list:
- First item
- Second item
  - Nested item 2.1
  - Nested item 2.2
- Third item
```

### Expected Result
- [ ] Bullet points display correctly
- [ ] Nested items are indented
- [ ] Proper spacing between items
- [ ] List markers are visible

### Test Prompt (Ordered)
```
Show me an ordered list:
1. First step
2. Second step
3. Third step
```

### Expected Result
- [ ] Numbers display correctly
- [ ] Proper spacing between items
- [ ] Sequential numbering

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## 5.3 Test Code Blocks

### Test Prompt (JavaScript)
```
Show me a JavaScript function:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return true;
}
```
```

### Expected Result
- [ ] Code block has dark background (#282c34)
- [ ] Syntax highlighting is applied
- [ ] Keywords are colored (function, const, return)
- [ ] Strings are colored
- [ ] Proper padding around code
- [ ] Horizontal scroll works for long lines
- [ ] Monospace font

### Test Prompt (Python)
```
Show me Python code:

```python
def greet(name):
    print(f"Hello, {name}!")
    return True
```
```

### Expected Result
- [ ] Python syntax highlighting works
- [ ] Keywords colored differently than JavaScript
- [ ] Indentation preserved

### Test Prompt (HTML/CSS)
```
Show me HTML and CSS:

```html
<div class="container">
  <h1>Title</h1>
</div>
```

```css
.container {
  padding: 20px;
  background: #fff;
}
```
```

### Expected Result
- [ ] HTML tags are colored
- [ ] CSS properties and values are colored
- [ ] Multiple code blocks render separately

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## 5.4 Test Inline Code

### Test Prompt
```
Use the `useState` hook in React or run `npm install` to install packages.
```

### Expected Result
- [ ] Inline code has pink/accent color
- [ ] Background is gray (light mode) or darker (dark mode)
- [ ] Monospace font
- [ ] Slight padding and rounded corners
- [ ] Visually distinct from regular text

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## 5.5 Test Links

### Test Prompt
```
Check out [Google](https://google.com) or visit [GitHub](https://github.com).
```

### Expected Result
- [ ] Links are colored (indigo)
- [ ] Links are clickable
- [ ] Hover shows underline
- [ ] Links open correctly
- [ ] Links are distinguishable from regular text

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## 5.6 Test Blockquotes

### Test Prompt
```
Here's a quote:

> This is a blockquote
> It spans multiple lines
> And should look distinct
```

### Expected Result
- [ ] Left border (vertical line) is visible
- [ ] Text is italic
- [ ] Different color (gray-600/400)
- [ ] Proper padding on left
- [ ] Visually distinct from regular text

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## 5.6 Test Tables

### Test Prompt
```
Show me a table:

| Feature | Status | Priority |
|---------|--------|----------|
| Markdown | Done | High |
| Syntax Highlighting | Done | High |
| Tables | Testing | Medium |
```

### Expected Result
- [ ] Table renders with borders
- [ ] Header row has distinct background
- [ ] Cells have proper padding
- [ ] Text is left-aligned
- [ ] Table is readable
- [ ] Responsive on mobile (scrollable if needed)

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## 5.7 Test XSS Prevention

### Test Prompt 1 (Script tag)
```
<script>alert('XSS')</script>
This should be safe.
```

### Expected Result
- [ ] No alert popup appears
- [ ] Script tag is removed or escaped
- [ ] Text "This should be safe" displays normally
- [ ] No JavaScript execution

### Test Prompt 2 (Event handler)
```
<img src=x onerror="alert('XSS')">
<a href="javascript:alert('XSS')">Click me</a>
```

### Expected Result
- [ ] No alert popup appears
- [ ] Event handlers are stripped
- [ ] No JavaScript execution
- [ ] Content is safe

### Test Prompt 3 (Iframe)
```
<iframe src="https://evil.com"></iframe>
```

### Expected Result
- [ ] Iframe is removed or escaped
- [ ] No external content loads
- [ ] Safe rendering

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## 5.8 Test Performance

### Test Prompt (Long response)
```
Give me a detailed explanation with multiple code examples, lists, and headings. Make it at least 1000 characters long.
```

### Expected Result
- [ ] Response renders smoothly
- [ ] No UI freezing or lag
- [ ] Scrolling is smooth
- [ ] No console errors
- [ ] Response time is acceptable

### Test Prompt (Multiple code blocks)
```
Show me 5 different code examples in different languages.
```

### Expected Result
- [ ] All code blocks render correctly
- [ ] Syntax highlighting works for all
- [ ] No performance degradation
- [ ] Memory usage is reasonable

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## 4.5 Test Dark Mode Compatibility

### Steps
1. [ ] Switch to dark mode (if available)
2. [ ] Test all markdown elements in dark mode
3. [ ] Check contrast and readability

### Expected Result
- [ ] All text is readable (white/gray-100)
- [ ] Code blocks have proper dark background
- [ ] Inline code is visible
- [ ] Links are visible (indigo-400)
- [ ] Headings are visible
- [ ] No white-on-white or black-on-black text

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## Additional Tests

### Mixed Content Test
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

### Expected Result
- [ ] All elements render correctly together
- [ ] Proper spacing between elements
- [ ] No layout issues
- [ ] No overlapping content

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## Edge Cases

### Empty Message
- [ ] Empty AI response doesn't break layout

### Malformed Markdown
```
**bold without closing
`code without closing
```
- [ ] Renders reasonably (doesn't crash)
- [ ] No console errors

### Very Long Code Line
```javascript
const veryLongVariableName = "This is a very long string that should trigger horizontal scrolling in the code block to test overflow handling and make sure it doesn't break the layout";
```
- [ ] Horizontal scroll appears
- [ ] Layout doesn't break
- [ ] Code is readable

### Status: ⬜ Not tested | ✅ Passed | ❌ Failed

---

## Browser Testing

### Desktop Browsers
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)

### Mobile Browsers
- [ ] Mobile Chrome
- [ ] Mobile Safari
- [ ] Mobile Firefox

### Expected Result
- [ ] Works on all browsers
- [ ] No browser-specific issues
- [ ] Responsive on mobile

---

## Final Checks

- [ ] No console errors during any test
- [ ] All markdown features work as expected
- [ ] Performance is acceptable
- [ ] Security (XSS) is working
- [ ] Dark mode works (if applicable)
- [ ] Mobile responsive
- [ ] Copy-paste from rendered markdown works

---

## Issues Found

Document any issues here:

1. 
2. 
3. 

---

## Overall Status

- Total tests: 11 sections
- Passed: ___
- Failed: ___
- Not tested: ___

**Ready for production?** ⬜ Yes | ⬜ No | ⬜ With caveats

**Notes:**
