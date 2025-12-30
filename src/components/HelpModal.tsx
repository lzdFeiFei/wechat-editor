import { X, Keyboard, HelpCircle, Lightbulb, BookOpen } from 'lucide-react'
import { useState } from 'react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'shortcuts' | 'faq' | 'tips' | 'about'

const SHORTCUTS = [
  { keys: ['Ctrl', 'B'], description: '加粗选中文字' },
  { keys: ['Ctrl', 'I'], description: '斜体选中文字' },
  { keys: ['Ctrl', 'U'], description: '下划线选中文字' },
  { keys: ['Ctrl', 'Z'], description: '撤销' },
  { keys: ['Ctrl', 'Y'], description: '重做' },
  { keys: ['Ctrl', 'S'], description: '保存当前内容' },
  { keys: ['Ctrl', 'K'], description: '插入链接' },
]

const FAQ = [
  {
    question: '如何复制内容到微信公众号？',
    answer:
      '点击底部工具栏的"复制到微信"按钮，然后打开微信公众号后台，在编辑器中使用 Ctrl+V 粘贴即可。',
  },
  {
    question: '图片上传有大小限制吗？',
    answer: '单张图片最大支持 10MB。系统会自动压缩图片到最大宽度 900px，以适配手机屏幕。',
  },
  {
    question: '草稿和模板有什么区别？',
    answer:
      '草稿保存完整的文章内容和主题，用于临时保存编辑中的文章。模板只保存文章框架和样式，用于快速创建具有相同风格的新文章。',
  },
  {
    question: '可以保存多少个草稿？',
    answer: '最多可以保存 10 个草稿。如需保存更多，请先删除一些不需要的草稿。',
  },
  {
    question: '如何修改主题颜色？',
    answer:
      '在左侧样式工具栏底部的"颜色主题"区域，点击选择预设的 5 套主题。主题会实时应用到预览区。',
  },
  {
    question: '内容会自动保存吗？',
    answer: '是的。系统每 30 秒自动保存一次到浏览器本地存储。你也可以随时按 Ctrl+S 手动保存。',
  },
]

const TIPS = [
  {
    icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
    title: '拖拽上传图片',
    description: '直接将图片拖拽到编辑器区域即可上传，无需点击按钮。',
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
    title: '使用模板快速开始',
    description: '如果不知道如何排版，可以选择一个预设模板开始编辑。',
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
    title: '保存自定义模板',
    description: '将常用的排版样式保存为自定义模板，下次可以快速复用。',
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
    title: '预览效果',
    description: '右侧预览区实时显示文章在微信公众号中的效果，所见即所得。',
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
    title: '粘贴纯文本',
    description: '从其他地方复制的内容粘贴时会自动清除格式，保持排版统一。',
  },
]

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('shortcuts')

  if (!isOpen) return null

  const tabs = [
    { id: 'shortcuts' as TabType, icon: Keyboard, label: '快捷键' },
    { id: 'faq' as TabType, icon: HelpCircle, label: '常见问题' },
    { id: 'tips' as TabType, icon: Lightbulb, label: '使用技巧' },
    { id: 'about' as TabType, icon: BookOpen, label: '关于' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">帮助文档</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">键盘快捷键</h3>
              <div className="grid gap-3">
                {SHORTCUTS.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="px-3 py-1 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-gray-400">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">常见问题</h3>
              <div className="space-y-4">
                {FAQ.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Q: {item.question}
                    </h4>
                    <p className="text-sm text-gray-600">A: {item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">使用技巧</h3>
              <div className="grid gap-4">
                {TIPS.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                    {tip.icon}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h4>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">关于本工具</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  微信公众号排版工具是一款免费、开源的在线编辑器，专为微信公众号文章排版设计。
                  支持丰富的样式工具、主题切换、图片上传、草稿管理等功能。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">技术栈</h3>
                <div className="flex flex-wrap gap-2">
                  {['React 18', 'TypeScript', 'Tailwind CSS', 'Quill.js', 'Vite'].map(
                    tech => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">功能特性</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 所见即所得的实时预览</li>
                  <li>• 5 套精美主题配色</li>
                  <li>• 图片自动压缩和优化</li>
                  <li>• 本地草稿自动保存</li>
                  <li>• 自定义模板管理</li>
                  <li>• 完全符合微信公众号规范</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">开源协议</h3>
                <p className="text-sm text-gray-600">MIT License</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
