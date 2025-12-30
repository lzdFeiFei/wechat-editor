import {
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Sparkles,
} from 'lucide-react'
import { useEditorContext } from '@/contexts/EditorContext'
import { useEditorCommands } from '@/hooks/useEditorCommands'
import { TEXT_COLORS, BACKGROUND_COLORS } from '@/types/style'
import { PRESET_THEMES } from '@/types/theme'
import { useState } from 'react'

export default function StylePanel() {
  const { quillInstance, currentTheme, applyTheme } = useEditorContext()
  const commands = useEditorCommands(quillInstance)
  const [showTextColors, setShowTextColors] = useState(false)
  const [showBgColors, setShowBgColors] = useState(false)

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* 文字样式 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-700">文字样式</h3>
          </div>
          <div className="space-y-2">
            {/* 标题 */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => commands.applyHeader(1)}
                className="px-3 py-2 text-sm text-left bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
              >
                H1
              </button>
              <button
                onClick={() => commands.applyHeader(2)}
                className="px-3 py-2 text-sm text-left bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
              >
                H2
              </button>
              <button
                onClick={() => commands.applyHeader(3)}
                className="px-3 py-2 text-sm text-left bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
              >
                H3
              </button>
              <button
                onClick={() => commands.applyHeader(false)}
                className="px-3 py-2 text-sm text-left bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
              >
                正文
              </button>
            </div>

            {/* 加粗、斜体、下划线、删除线 */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={commands.toggleBold}
                className="flex items-center justify-center p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="加粗 (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={commands.toggleItalic}
                className="flex items-center justify-center p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="斜体 (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={commands.toggleUnderline}
                className="flex items-center justify-center p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="下划线 (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                onClick={commands.toggleStrike}
                className="flex items-center justify-center p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="删除线"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            {/* 文字颜色 */}
            <div className="relative">
              <button
                onClick={() => setShowTextColors(!showTextColors)}
                className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-between"
              >
                <span>文字颜色</span>
                <div className="w-4 h-4 border border-gray-300 rounded bg-black" />
              </button>
              {showTextColors && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
                  <div className="grid grid-cols-4 gap-2">
                    {TEXT_COLORS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => {
                          commands.applyTextColor(color.value)
                          setShowTextColors(false)
                        }}
                        className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 背景色 */}
            <div className="relative">
              <button
                onClick={() => setShowBgColors(!showBgColors)}
                className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-between"
              >
                <span>背景高亮</span>
                <div className="w-4 h-4 border border-gray-300 rounded bg-yellow-200" />
              </button>
              {showBgColors && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
                  <div className="grid grid-cols-4 gap-2">
                    {BACKGROUND_COLORS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => {
                          commands.applyBackgroundColor(color.value)
                          setShowBgColors(false)
                        }}
                        className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 段落样式 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlignLeft className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-700">段落样式</h3>
          </div>
          <div className="space-y-2">
            {/* 对齐方式 */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => commands.applyAlign('')}
                className="flex items-center justify-center p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="左对齐"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => commands.applyAlign('center')}
                className="flex items-center justify-center p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="居中"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => commands.applyAlign('right')}
                className="flex items-center justify-center p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="右对齐"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => commands.applyAlign('justify')}
                className="flex items-center justify-center p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="两端对齐"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* 列表 */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => commands.applyList('ordered')}
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="有序列表"
              >
                <ListOrdered className="w-4 h-4" />
                <span>有序</span>
              </button>
              <button
                onClick={() => commands.applyList('bullet')}
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
                title="无序列表"
              >
                <List className="w-4 h-4" />
                <span>无序</span>
              </button>
            </div>
          </div>
        </div>

        {/* 特殊组件 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-700">特殊组件</h3>
          </div>
          <div className="space-y-2">
            <button
              onClick={commands.toggleBlockquote}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
            >
              <Quote className="w-4 h-4" />
              <span>引用框</span>
            </button>
            <button
              onClick={commands.insertDivider}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-primary hover:text-white rounded-md transition-colors"
            >
              <Minus className="w-4 h-4" />
              <span>分割线</span>
            </button>
          </div>
        </div>

        {/* 颜色主题 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-700">颜色主题</h3>
          </div>
          <div className="space-y-2">
            {PRESET_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme)}
                className={`w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
                  currentTheme.id === theme.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{theme.name}</div>
                    <div
                      className={`text-xs mt-1 ${
                        currentTheme.id === theme.id ? 'text-white/80' : 'text-gray-500'
                      }`}
                    >
                      {theme.description}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.headingColor }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
