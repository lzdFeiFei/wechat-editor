/**
 * Editor Component - Tiptap Version
 *
 * Main editor component using Tiptap instead of Quill.
 * Supports Markdown, drag-and-drop image upload, auto-save, keyboard shortcuts.
 */

import { useEffect, useState, useCallback } from 'react'
import { EditorContent } from '@tiptap/react'
import '@/styles/tiptap-custom.css'
import { useEditorContext } from '@/contexts/EditorContext'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useTiptapEditor } from '@/hooks/useTiptapEditor'
import { saveCurrentDraft, loadCurrentDraft, formatRelativeTime, getLastSavedTime } from '@/utils/storage'
import { Save, Check } from 'lucide-react'

export default function Editor() {
  const { content, updateContent, setEditor } = useEditorContext()
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Handle content update
  const handleUpdate = useCallback(
    (html: string, text: string) => {
      updateContent(html, text)
    },
    [updateContent]
  )

  // Initialize Tiptap editor
  const editor = useTiptapEditor({
    content: '',
    onUpdate: handleUpdate,
    editable: true,
  })

  // Save function
  const handleSave = useCallback(() => {
    if (editor) {
      const html = editor.getHTML()
      saveCurrentDraft(html)
      setLastSaved(new Date())
      setShowSaveIndicator(true)
      setTimeout(() => setShowSaveIndicator(false), 2000)
    }
  }, [editor])

  // Image upload function
  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return

      try {
        // Convert image to Base64
        const reader = new FileReader()
        reader.onload = e => {
          const dataUrl = e.target?.result as string
          if (dataUrl) {
            // Insert image using Tiptap Image extension
            editor.chain().focus().setImage({ src: dataUrl }).run()
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Image upload failed:', error)
      }
    },
    [editor]
  )

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length === 0) return

      // Process image files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          await handleImageUpload(file)
          break // Upload one at a time
        }
      }
    },
    [handleImageUpload]
  )

  // Keyboard shortcuts
  useKeyboardShortcuts(editor, handleSave)

  // Auto-save every 30 seconds
  useAutoSave(content.html, handleSave, { delay: 30000 })

  // Initialize editor and load saved content
  useEffect(() => {
    if (editor) {
      // Set editor instance to context
      setEditor(editor)

      // Load saved draft
      const savedContent = loadCurrentDraft()
      if (savedContent) {
        editor.commands.setContent(savedContent)
        const lastSavedTime = getLastSavedTime()
        if (lastSavedTime) {
          setLastSaved(lastSavedTime)
        }
      }
    }

    return () => {
      if (editor) {
        setEditor(null)
      }
    }
  }, [editor, setEditor])

  return (
    <div
      className="flex-1 bg-white flex flex-col relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary bg-opacity-10 border-4 border-dashed border-primary z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <div className="text-primary text-lg font-medium mb-2">释放以上传图片</div>
            <div className="text-sm text-gray-600">支持 JPG、PNG、GIF 格式</div>
          </div>
        </div>
      )}

      {/* Editor Header */}
      <div className="border-b border-gray-200 px-4 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <span>编辑区域</span>
            {showSaveIndicator && (
              <span className="flex items-center gap-1 text-success">
                <Check className="w-4 h-4" />
                已保存
              </span>
            )}
            {lastSaved && !showSaveIndicator && (
              <span className="flex items-center gap-1 text-gray-500">
                <Save className="w-4 h-4" />
                {formatRelativeTime(lastSaved)}
              </span>
            )}
          </div>
          <span>
            字数: {content.wordCount} | 预计阅读: {content.readTime}分钟
          </span>
        </div>
      </div>

      {/* Tiptap Editor */}
      <div className="flex-1 min-h-0 overflow-auto">
        <EditorContent editor={editor} className="h-full tiptap-editor" />
      </div>
    </div>
  )
}
