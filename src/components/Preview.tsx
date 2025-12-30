import { Smartphone } from 'lucide-react'
import { useEditorContext } from '@/contexts/EditorContext'
import { generateThemeStyles } from '@/utils/theme-styles'
import { useMemo } from 'react'

export default function Preview() {
  const { content, currentTheme } = useEditorContext()

  // 生成主题样式
  const themeStyles = useMemo(() => generateThemeStyles(currentTheme), [currentTheme])

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto">
      {/* 注入主题样式 */}
      <style>{themeStyles}</style>

      <div className="border-b border-gray-200 px-4 py-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Smartphone className="w-4 h-4" />
            <span>手机预览 (375px)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <span>{currentTheme.name}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex justify-center">
        <div className="w-[375px] bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {content.html ? (
              <div
                className="preview-content prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            ) : (
              <div className="text-center text-gray-400 py-20">
                预览区域
                <br />
                <span className="text-sm">编辑内容将实时显示在这里</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
