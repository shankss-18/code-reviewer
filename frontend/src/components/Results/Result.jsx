import "./index.css"
import { useState } from "react"
import FixedCodeEditor from "../fixedCode/FixedCode"    

const Result = ({data, loading}) => {
    const [errors, setErrors] = useState(true)
    const [suggestion, setSuggestion] = useState(false)
    const [correctCode, setCorrectCode] = useState(true)
    const [copied, setCopied] = useState(false)
    
    if (loading) {
        return (
        <div className="result-wrapper flex justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0078D4]"></div>
        </div>
    )
    }
    
    if (data === null) {
        return (
        <div className="result-wrapper flex justify-center items-center">
            <p className="text-md text-gray-500">No code to review</p>
        </div>
    )
    }

    const parsed = JSON.parse(data.reply)
    const errorList = parsed.errors || []
    const suggestionList = parsed.suggestions || []
    const code = parsed.fixedCode || ""

    return (
        <div className="result-wrapper">

            {/*error box */}
            <div className="bg-[#1A1A1A] box flex justify-between items-center cursor-pointer" onClick={() => setErrors(!errors)}>
                <div className="flex items-center">
                    <div className="h-[12px] w-[12px] bg-red-500 rounded-full"></div>
                    <h2 className="text-sm mll">Errors</h2>
                </div>
                <div className="flex items-center justify-center h-[24px] w-[24px] bg-[#421B1B] border border-[#6D1B1B] rounded-full">
                    <p className="text-xs text-[#F87171]">{errorList.length}</p>
                </div>
            </div>
            {errors && (
                <div className="bg-[#141414] dbox">
                    {errorList.map((err) => {
                        return (
                            <div className="bg-[#1A1010] border border-[#351414] errorsBox flex justify-start items-center w-full overflow-hidden">
                                <div className="ml-2 w-full">
                                    <div className="flex justify-between items-center headbox">
                                        <h2 className="text-md text-[#DC6565] font-semibold">{err.errorName}</h2>
                                        <p className="text-xs text-[#47474F]">line {err.line}</p>
                                    </div>
                                    <p className="text-sm text-gray">{err.explanation}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/*suggestion box */}

            <div className="bg-[#1A1A1A] box flex justify-between items-center cursor-pointer" onClick={() => setSuggestion(!suggestion)}>
                <div className="flex items-center">
                    <div className="h-[12px] w-[12px] bg-[#FFDB04] rounded-full"></div>
                    <h2 className="text-sm mll">Suggestions</h2>
                </div>
                <div className="flex items-center justify-center h-[24px] w-[24px] bg-[#3D2917] border border-[#613B13] rounded-full">
                    <p className="text-xs text-[#FACC15]">{suggestionList.length}</p>
                </div>
            </div>
            {suggestion && (
                <div className="bg-[#141414] dbox">
                    {suggestionList.map((sugg) => {
                        return (
                            <div className="bg-[#1A1800] border border-[#3D3200] suggesBox flex justify-start items-center w-full overflow-hidden">
                                <div className="ml-2 w-full">
                                    <div className="flex justify-between items-center headbox">
                                        <h2 className="text-md text-[#FFE88A] font-semibold">{sugg.suggestionName}</h2>
                                        <p className="text-xs text-[#47474F]">line {sugg.line}</p>
                                    </div>
                                    <p className="text-sm text-gray">{sugg.explanation}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/*correct code box */}

            <div className="bg-[#1A1A1A] box flex justify-between items-center cursor-pointer" onClick={() => setCorrectCode(!correctCode)}>
                <div className="flex items-center">
                    <div className="h-[12px] w-[12px] bg-[#04FF04] rounded-full"></div>
                    <h2 className="text-sm mll">Fixed Code</h2>
                </div>
                <div className="flex items-center justify-center h-[28px] w-[60px] bg-[#17232D] border border-[#103C5F] rounded" onClick={() => {navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000)}}>
                    <p className="text-xs text-[#0078D4]">{copied ? "Copied!" : "Copy"}</p>
                </div>
            </div>
            {correctCode && (
                <div className="bg-[#141414] dbox">
                    <FixedCodeEditor code={code}/>
                </div>
            )}



        </div>
    )
}

export default Result