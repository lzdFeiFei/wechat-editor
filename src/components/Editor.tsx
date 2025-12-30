import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import '@/styles/quill-custom.css'
import { useEditorContext } from '@/contexts/EditorContext'

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const { content, updateContent } = useEditorContext()

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      // 初始化 Quill 编辑器
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: '在这里开始编辑你的文章...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      })

      // 监听内容变化
      quillRef.current.on('text-change', () => {
        if (quillRef.current) {
          const html = quillRef.current.root.innerHTML
          const text = quillRef.current.getText()
          updateContent(html, text)
        }
      })
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null
      }
    }
  }, [updateContent])

  return (
    <div className="flex-1 bg-white overflow-hidden flex flex-col">
      <div className="border-b border-gray-200 px-4 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>编辑区域</span>
          <span>
            字数: {content.wordCount} | 预计阅读: {content.readTime}分钟
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div ref={editorRef} className="h-full" />
      </div>
    </div>
  )
}
