import { FileText, Github } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">微信公众号排版工具</h1>
            <p className="text-sm text-gray-500">简洁、免费、易用</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            草稿
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            帮助
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  )
}
