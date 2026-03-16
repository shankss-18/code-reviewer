import CodeEditor from "./components/CodeEditor/CodeEditor"
import Result from "./components/Results/Result"
import "./index.css"
import { useState } from "react"

function App() {
  const [data, setData] = useState(null)
  const [loading , setLoading] = useState(false)
  return (
    <div className="bg-[#1e1e1e] grid grid-cols-5 h-screen overflow-hidden">
      <div className="col-span-3">
        <CodeEditor setData={setData} setLoading={setLoading}/>
      </div>
      <div className="bg-[#0D0D0D] col-span-2 overflow-auto custom-scroll">
        <Result data={data} loading={loading}/>
      </div>
    </div>
  )
}

export default App