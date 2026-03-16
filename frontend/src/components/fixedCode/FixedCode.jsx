import Editor from "@monaco-editor/react"
import "./index.css"

const FIXED_CODE = `function getUser(id) {
  const query = "SELECT * FROM users WHERE id = ?";
  
  try {
    const result = db.query(query, [id]);
    
    if (!result) return null;

    for (let i = 0; i < result.length; i++) {
      process(result[i]);
    }

    return result;
    
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}`

function FixedCodeEditor({code}) {
  return (
    <div className="fixed-editor-wrapper">
      <div className="fixed-editor-area">
        <Editor
          value={code}
          language="javascript"
          theme="vs-dark"
          options={{
            readOnly: true,              
            fontSize: 12,
            fontFamily: "JetBrains Mono, monospace",
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "off",
            padding: { top: 12 },
            renderLineHighlight: "none", 
            cursorStyle: "line",
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
              useShadows: false,
            },
            contextmenu: false,
            selectionHighlight: false,
            occurrencesHighlight: false,
            codeLens: false,
            folding: false,
            lineNumbers: "on",
            renderValidationDecorations: "off",
          }}
        />
      </div>

    </div>
  )
}

export default FixedCodeEditor