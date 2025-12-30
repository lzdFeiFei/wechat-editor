import { Palette, Type, AlignLeft, Image } from 'lucide-react'

export default function StylePanel() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">样式工具</h2>

        {/* 文字样式 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-700">文字样式</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              标题 1
            </button>
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              标题 2
            </button>
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              标题 3
            </button>
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              正文
            </button>
          </div>
        </div>

        {/* 段落样式 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlignLeft className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-700">段落样式</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              对齐方式
            </button>
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              行距调整
            </button>
          </div>
        </div>

        {/* 特殊组件 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-700">特殊组件</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              分割线
            </button>
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              引用框
            </button>
          </div>
        </div>

        {/* 颜色主题 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-700">颜色主题</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              经典黑白
            </button>
            <button className="w-full px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              科技蓝
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
