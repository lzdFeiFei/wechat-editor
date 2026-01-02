/**
 * EditorContext - Updated for Tiptap
 *
 * Provides editor instance and theme management to child components
 */

import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@/hooks/useEditor'
import { useTheme } from '@/hooks/useTheme'
import { Theme } from '@/types/theme'
import type { Editor } from '@tiptap/react'

interface EditorContextType {
  content: EditorContent
  updateContent: (html: string, text: string) => void
  editor: Editor | null
  setEditor: (editor: Editor | null) => void
  currentTheme: Theme
  applyTheme: (theme: Theme) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
  const editorContent = useEditor()
  const theme = useTheme()
  const [editor, setEditorState] = useState<Editor | null>(null)

  const setEditor = useCallback((editorInstance: Editor | null) => {
    setEditorState(editorInstance)
  }, [])

  return (
    <EditorContext.Provider
      value={{
        ...editorContent,
        editor,
        setEditor,
        ...theme
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEditorContext() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider')
  }
  return context
}
