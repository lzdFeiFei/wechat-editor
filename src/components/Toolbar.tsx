import { Upload, Save, Copy, Trash2 } from 'lucide-react'

export default function Toolbar() {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
            <Upload className="w-4 h-4" />
            导入文本
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
            <Upload className="w-4 h-4" />
            插入图片
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
            <Save className="w-4 h-4" />
            保存草稿
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary hover:bg-blue-600 text-white rounded-md transition-colors">
            <Copy className="w-4 h-4" />
            一键复制
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        </div>
      </div>
    </div>
  )
}
