import { createContext, useContext, ReactNode } from 'react'
import { useEditor, EditorContent } from '@/hooks/useEditor'

interface EditorContextType {
  content: EditorContent
  updateContent: (html: string, text: string) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
  const editor = useEditor()

  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
}

export function useEditorContext() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider')
  }
  return context
}
