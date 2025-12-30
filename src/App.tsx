import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">
        微信公众号排版工具
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        WeChat Editor - Hello World!
      </p>
      <div>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-2 text-base bg-primary text-white rounded-md cursor-pointer hover:opacity-90 transition-opacity"
        >
          点击次数: {count}
        </button>
      </div>
      <p className="mt-8 text-gray-400">
        项目初始化成功 ✓
      </p>
    </div>
  )
}

export default App
