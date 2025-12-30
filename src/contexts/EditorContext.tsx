import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@/hooks/useEditor'
import { useTheme } from '@/hooks/useTheme'
import { Theme } from '@/types/theme'
import Quill from 'quill'

interface EditorContextType {
  content: EditorContent
  updateContent: (html: string, text: string) => void
  quillInstance: Quill | null
  setQuillInstance: (quill: Quill | null) => void
  currentTheme: Theme
  applyTheme: (theme: Theme) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
  const editor = useEditor()
  const theme = useTheme()
  const [quillInstance, setQuillInstanceState] = useState<Quill | null>(null)

  const setQuillInstance = useCallback((quill: Quill | null) => {
    setQuillInstanceState(quill)
  }, [])

  return (
    <EditorContext.Provider
      value={{ ...editor, quillInstance, setQuillInstance, ...theme }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorContext() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider')
  }
  return context
}
