import { useState } from "react"
import Editor from "@monaco-editor/react"
import "./index.css"

const initialCode = ""

const LANGUAGES = ["javascript", "python", "java", "cpp"]

const FILENAMES = {
  javascript: "main.js",
  python: "main.py",
  java: "Main.java",
  cpp: "main.cpp",
}

const LANGUAGE_LABELS = {
  javascript: "JAVASCRIPT",
  python: "PYTHON",
  java: "JAVA",
  cpp: "C++",
}

function CodeEditor({setData, setLoading}) {

  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState("javascript")

  async function checkCode() {
    if(code === ""){
      alert("Please enter code")
      return
    }
    setLoading(true)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, language: language })
    });
    setData(await res.json());
    setLoading(false)
  }

  return (
    <div className="editor-wrapper">

      <div className="tab-bar">
        <div className="active-tab">
          <div className="tab-dot" />
          <span className="tab-filename">{FILENAMES[language]}</span>
        </div>
        <select
          className="lang-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_LABELS[lang]}
            </option>
          ))}
        </select>
      </div>

      <div className="editor-area">
        <Editor
          language={language}
          value={code}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: "line",
            cursorStyle: "line",
            padding: { top: 14 },
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
          onChange={(value) => setCode(value)}
        />
      </div>

      <div className="review-btn-wrapper">
        <button className="review-btn" onClick={checkCode}>
          ▶  Review Code
        </button>
      </div>

    </div>
  )
}
export default CodeEditor 