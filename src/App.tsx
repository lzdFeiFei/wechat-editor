import { useState } from 'react'
import Header from './components/Header'
import StylePanel from './components/StylePanel'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Toolbar from './components/Toolbar'
import OnboardingTour from './components/OnboardingTour'
import ToastContainer from './components/ToastContainer'
import { EditorProvider } from './contexts/EditorContext'
import { useToast } from './hooks/useToast'

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const { toasts, closeToast } = useToast()

  return (
    <EditorProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* 顶部导航栏 */}
        <Header />

        {/* 主体内容区 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧样式工具栏 */}
          <div className="style-panel">
            <StylePanel />
          </div>

          {/* 中间编辑区 */}
          <div className="editor-area flex-1">
            <Editor />
          </div>

          {/* 右侧预览区 */}
          <div className="preview-area">
            <Preview />
          </div>
        </div>

        {/* 底部工具栏 */}
        <div className="toolbar-area">
          <Toolbar />
        </div>

        {/* 首次使用引导 */}
        {showOnboarding && <OnboardingTour onComplete={() => setShowOnboarding(false)} />}

        {/* Toast通知 */}
        <ToastContainer toasts={toasts} onClose={closeToast} />
      </div>
    </EditorProvider>
  )
}

export default App
