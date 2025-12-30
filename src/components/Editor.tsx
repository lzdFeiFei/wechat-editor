import { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import '@/styles/quill-custom.css'
import { useEditorContext } from '@/contexts/EditorContext'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useImageUpload } from '@/hooks/useImageUpload'
import { saveCurrentDraft, loadCurrentDraft, formatRelativeTime, getLastSavedTime } from '@/utils/storage'
import { registerDivider } from '@/utils/quill-divider'
import { Save, Check } from 'lucide-react'

// 注册自定义 Blot
registerDivider()

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const { content, updateContent, setQuillInstance } = useEditorContext()
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { uploadImage } = useImageUpload(quillRef.current)

  // 保存函数
  const handleSave = () => {
    if (quillRef.current) {
      const html = quillRef.current.root.innerHTML
      saveCurrentDraft(html)
      setLastSaved(new Date())
      setShowSaveIndicator(true)
      setTimeout(() => setShowSaveIndicator(false), 2000)
    }
  }

  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length === 0) return

    // 只处理第一个图片文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        try {
          await uploadImage(file)
        } catch (error) {
          console.error('拖拽上传失败:', error)
        }
        break // 一次只上传一张
      }
    }
  }

  // 快捷键支持
  useKeyboardShortcuts(quillRef.current, handleSave)

  // 自动保存（每30秒）
  useAutoSave(content.html, handleSave, { delay: 30000 })

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      // 初始化 Quill 编辑器
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: '在这里开始编辑你的文章...\n\n快捷键提示：\nCtrl+B 加粗 | Ctrl+I 斜体 | Ctrl+U 下划线\nCtrl+Z 撤销 | Ctrl+Y 重做 | Ctrl+S 保存',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
          history: {
            delay: 1000,
            maxStack: 100,
            userOnly: true,
          },
          clipboard: {
            matchVisual: false, // 粘贴时不保留视觉格式
          },
        },
      })

      // 将 quill 实例添加到 context
      setQuillInstance(quillRef.current)

      // 加载之前保存的内容
      const savedContent = loadCurrentDraft()
      if (savedContent) {
        quillRef.current.root.innerHTML = savedContent
        const lastSavedTime = getLastSavedTime()
        if (lastSavedTime) {
          setLastSaved(lastSavedTime)
        }
      }

      // 监听内容变化
      quillRef.current.on('text-change', () => {
        if (quillRef.current) {
          const html = quillRef.current.root.innerHTML
          const text = quillRef.current.getText()
          updateContent(html, text)
        }
      })

      // 粘贴时清除格式
      quillRef.current.clipboard.addMatcher(Node.ELEMENT_NODE, (node) => {
        const plaintext = (node as HTMLElement).textContent || ''
        const Delta = Quill.import('delta') as any
        return new Delta().insert(plaintext)
      })
    }

    return () => {
      if (quillRef.current) {
        setQuillInstance(null)
        quillRef.current = null
      }
    }
  }, [updateContent, setQuillInstance])

  return (
    <div
      className="flex-1 bg-white overflow-hidden flex flex-col relative"
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
      <div className="flex-1 overflow-y-auto">
        <div ref={editorRef} className="h-full" />
      </div>
    </div>
  )
}
