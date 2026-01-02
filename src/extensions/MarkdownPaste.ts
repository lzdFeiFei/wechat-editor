/**
 * MarkdownPaste Extension for Tiptap
 *
 * Automatically detects and converts Markdown syntax when pasting.
 * Supports common Markdown syntax: headings, bold, italic, lists, links, code blocks, etc.
 */

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import MarkdownIt from 'markdown-it'

// Initialize markdown-it parser
const md = new MarkdownIt({
  html: true,        // Allow HTML tags in source
  breaks: true,      // Convert '\n' to <br>
  linkify: true,     // Auto-convert URLs to links
  typographer: true, // Enable smart quotes
})

/**
 * Check if text contains Markdown syntax
 */
function isMarkdown(text: string): boolean {
  const markdownPatterns = [
    /^#{1,6}\s/m,           // Headings: # ## ###
    /\*\*[^*]+\*\*/,        // Bold: **text**
    /\*[^*]+\*/,            // Italic: *text*
    /\[[^\]]+\]\([^)]+\)/,  // Links: [text](url)
    /^[-*+]\s/m,            // Unordered lists: - * +
    /^\d+\.\s/m,            // Ordered lists: 1. 2.
    /^>\s/m,                // Blockquotes: >
    /```[\s\S]*?```/,       // Code blocks: ```
    /`[^`]+`/,              // Inline code: `code`
    /!\[[^\]]*\]\([^)]+\)/, // Images: ![alt](url)
  ]

  return markdownPatterns.some(pattern => pattern.test(text))
}

/**
 * Clean HTML for Tiptap compatibility
 * Removes tags and attributes that Tiptap doesn't support
 */
function cleanHTML(html: string): string {
  // Create temporary DOM element
  const temp = document.createElement('div')
  temp.innerHTML = html

  // Remove script and style tags
  temp.querySelectorAll('script, style').forEach(el => el.remove())

  // Remove dangerous attributes
  temp.querySelectorAll('*').forEach(el => {
    const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover']
    dangerousAttrs.forEach(attr => {
      if (el.hasAttribute(attr)) {
        el.removeAttribute(attr)
      }
    })
  })

  return temp.innerHTML
}

export const MarkdownPaste = Extension.create({
  name: 'markdownPaste',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownPaste'),

        props: {
          handlePaste: (_view, event) => {
            // Get clipboard data
            const text = event.clipboardData?.getData('text/plain')
            const html = event.clipboardData?.getData('text/html')

            // If there's HTML content, let Tiptap handle it normally
            if (html) {
              return false
            }

            // If no text, return
            if (!text) {
              return false
            }

            // Check if text contains Markdown syntax
            if (!isMarkdown(text)) {
              return false
            }

            // Prevent default paste behavior
            event.preventDefault()

            // Convert Markdown to HTML
            const htmlContent = md.render(text)

            // Clean HTML
            const cleanedHTML = cleanHTML(htmlContent)

            // Insert content into editor
            this.editor.commands.insertContent(cleanedHTML)

            return true
          },
        },
      }),
    ]
  },
})
