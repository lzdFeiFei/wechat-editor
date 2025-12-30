import Header from './components/Header'
import StylePanel from './components/StylePanel'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Toolbar from './components/Toolbar'
import { EditorProvider } from './contexts/EditorContext'

function App() {
  return (
    <EditorProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* 顶部导航栏 */}
        <Header />

        {/* 主体内容区 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧样式工具栏 */}
          <StylePanel />

          {/* 中间编辑区 */}
          <Editor />

          {/* 右侧预览区 */}
          <Preview />
        </div>

        {/* 底部工具栏 */}
        <Toolbar />
      </div>
    </EditorProvider>
  )
}

export default App
