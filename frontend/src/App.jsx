import CodeEditor from "./components/CodeEditor/CodeEditor"
import Result from "./components/Results/Result"
import "./index.css"
import { useState } from "react"

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <div className="hidden md:grid md:grid-cols-5 h-screen overflow-hidden bg-[#1e1e1e]">
        <div className="md:col-span-3 h-full">
          <CodeEditor setData={setData} setLoading={setLoading} />
        </div>
        <div className="bg-[#0D0D0D] md:col-span-2 overflow-auto custom-scroll">
          <Result data={data} loading={loading} />
        </div>
      </div>

      <div className="flex md:hidden flex-col items-center justify-center h-screen bg-[#0d0d0d] mbox gap-6">
        <p className="text-[#cccccc] text-lg font-semibold text-center"> 
          Built for Desktop
        </p>
        <p className="text-[#555555] text-xs text-center leading-relaxed">
          AI Code Reviewer is designed for a keyboard and large screen.
          Please open it on your laptop or desktop for the best experience.
        </p>
        <div className="flex items-center gap-2 mt-2 rounded-lg px-5 py-3">
          <span className="text-[#0078d4] font-mono text-sm cursor-pointer" onClick={() => window.open("https://ai-code-reviewer.vercel.app", "_blank")}>ai-code-reviewer.vercel.app</span>
        </div>
        <p className="text-[#555555] text-xs text-center leading-relaxed">
          Made by Shanks
        </p>
      </div>

    </div>
  )
}

export default App