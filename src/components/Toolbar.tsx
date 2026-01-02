import { Upload, Save, Copy, Trash2, Check, AlertCircle } from 'lucide-react'
import { useEditorContext } from '@/contexts/EditorContext'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { generateWechatHTML } from '@/utils/wechat-html'
import { clearCurrentDraft } from '@/utils/storage'
import { useState } from 'react'

export default function Toolbar() {
  const { content, currentTheme, editor } = useEditorContext()
  const { copyHTML, isCopying } = useCopyToClipboard()
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showTip, setShowTip] = useState(false)

  // 处理一键复制
  const handleCopy = async () => {
    if (!content.html) {
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
      return
    }

    // 生成微信格式HTML
    const wechatHTML = generateWechatHTML(content.html, currentTheme)

    await copyHTML(wechatHTML, {
      onSuccess: () => {
        setCopyStatus('success')
        setShowTip(true)
        setTimeout(() => {
          setCopyStatus('idle')
          setShowTip(false)
        }, 3000)
      },
      onError: () => {
        setCopyStatus('error')
        setTimeout(() => setCopyStatus('idle'), 2000)
      },
    })
  }

  // 处理清空
  const handleClear = () => {
    if (window.confirm('确定要清空所有内容吗？此操作无法撤销。')) {
      if (editor) {
        editor.commands.clearContent()
        clearCurrentDraft()
      }
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            导入文本
          </button>
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            插入图片
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            保存草稿
          </button>

          {/* 一键复制按钮 */}
          <div className="relative">
            <button
              onClick={handleCopy}
              disabled={isCopying || !content.html}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
                copyStatus === 'success'
                  ? 'bg-success text-white'
                  : copyStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-primary hover:bg-blue-600 text-white'
              } ${!content.html || isCopying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {copyStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制
                </>
              ) : copyStatus === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  复制失败
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  一键复制
                </>
              )}
            </button>

            {/* 首次使用提示 */}
            {showTip && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                <div className="font-medium mb-1">复制成功！</div>
                <div className="text-gray-300">
                  现在可以直接粘贴到微信公众号后台编辑器中
                </div>
                <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            )}
          </div>

          <button
            onClick={handleClear}
            disabled={!content.html}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              content.html
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        </div>
      </div>
    </div>
  )
}
