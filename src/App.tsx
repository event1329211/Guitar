import { useState } from 'react'
import GuitarFretboard from './components/GuitarFretboard'

function App() {
  const [currentTab, setCurrentTab] = useState("全音符")
  const ALL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const [currentKey, setCurrentKey] = useState('C')
  const [activePatterns, setActivePatterns] = useState<number[]>([])
  const [patternType, setPatternType] = useState<"3NPS" | "CAGED">("3NPS")
  const [useNumberNotation] = useState(false)
  const [scaleType, setScaleType] = useState<"major" | "minor" | "pentatonic" | "dorian" | "phrygian" | "lydian" | "mixolydian" | "locrian">("major")

  const handlePatternToggle = (patternIndex: number) => {
    setActivePatterns(prev => {
      if (prev.includes(patternIndex)) {
        return prev.filter(p => p !== patternIndex)
      } else {
        return [...prev, patternIndex]
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
    

      
      <header className="sticky top-0 z-10 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <h1 className="text-2xl font-bold">
            吉他指版音階
          </h1>
          <div className="ml-auto flex items-center gap-4">
            {/* <div className="flex items-center gap-2">
              <span className="text-sm font-medium">記譜法:</span>
              <button 
                onClick={() => setUseNumberNotation(!useNumberNotation)}
                className="px-3 py-1 rounded-md border flex items-center"
              >
                <span className={`px-2 py-1 rounded-sm text-xs font-medium transition-colors ${!useNumberNotation ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                  CDE
                </span>
                <span className={`px-2 py-1 rounded-sm text-xs font-medium transition-colors ${useNumberNotation ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                  123
                </span>
              </button>
            </div> */}
            <select 
              value={currentKey} 
              onChange={(e) => setCurrentKey(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {ALL_KEYS.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b mb-6">
          <button 
            onClick={() => setCurrentTab("全音符")}
            className={`px-4 py-2 ${currentTab === "全音符" ? "border-b-2 border-blue-500 font-medium" : ""}`}
          >
            全音符模式
          </button>
          <button 
            onClick={() => setCurrentTab("單音")}
            className={`px-4 py-2 ${currentTab === "單音" ? "border-b-2 border-blue-500 font-medium" : ""}`}
          >
            單音模式
          </button>
          <button 
            onClick={() => {setCurrentTab("3NPS"); setPatternType("3NPS")}}
            className={`px-4 py-2 ${currentTab === "3NPS" ? "border-b-2 border-blue-500 font-medium" : ""}`}
          >
            3NPS模式
          </button>
          <button 
            onClick={() => {setCurrentTab("CAGED"); setPatternType("CAGED")}}
            className={`px-4 py-2 ${currentTab === "CAGED" ? "border-b-2 border-blue-500 font-medium" : ""}`}
          >
            CAGED模式
          </button>
        </div>
        
        {currentTab === "單音" && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">單音模式</h2>
              <p className="text-gray-600 mb-4">
                在吉他指版上顯示選定音符的所有位置。選擇一個音符查看它在整個指板上的所有位置。
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_KEYS.map(key => (
                  <button 
                    key={key} 
                    onClick={() => setCurrentKey(key)}
                    className={`w-12 h-12 rounded-full font-medium 
                      ${key === currentKey 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border">
              <GuitarFretboard 
                currentKey={currentKey} 
                noteMode={true} 
                useNumberNotation={useNumberNotation}
              />
            </div>
          </div>
        )}

        {currentTab === "全音符" && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">全音符模式</h2>
              <p className="text-gray-600 mb-4">
                顯示選定調性的所有音符在吉他指板上的位置。
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">選擇調性</h3>
                  <div className="flex flex-wrap gap-2">
                    {ALL_KEYS.map(key => (
                      <button 
                        key={key} 
                        onClick={() => setCurrentKey(key)}
                        className={`px-4 py-2 rounded-md font-medium 
                          ${key === currentKey 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-100 hover:bg-gray-200"
                          }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">選擇音階類型</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button 
                      onClick={() => setScaleType("major")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${scaleType === "major" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      大調/Ionian
                    </button>
                    <button 
                      onClick={() => setScaleType("minor")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${scaleType === "minor" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      小調/Aeolian
                    </button>
                    <button 
                      onClick={() => setScaleType("pentatonic")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${scaleType === "pentatonic" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      五聲音階
                    </button>
                    <button 
                      onClick={() => setScaleType("dorian")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${scaleType === "dorian" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      Dorian
                    </button>
                    <button 
                      onClick={() => setScaleType("phrygian")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${scaleType === "phrygian" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      Phrygian
                    </button>
                    <button 
                      onClick={() => setScaleType("lydian")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${scaleType === "lydian" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      Lydian
                    </button>
                    <button 
                      onClick={() => setScaleType("mixolydian")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${scaleType === "mixolydian" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      Mixolydian
                    </button>
                    <button 
                      onClick={() => setScaleType("locrian")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${scaleType === "locrian" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      Locrian
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border">
              <GuitarFretboard 
                currentKey={currentKey} 
                allNotesMode={true}
                useNumberNotation={useNumberNotation}
                scaleType={scaleType}
              />
            </div>
          </div>
        )}
        
        {currentTab === "3NPS" && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">3NPS音階模式</h2>
              <p className="text-gray-600 mb-4">
                每弦三音模式(3 Notes Per String)，學習各種音階模式以及它們在吉他指版上的位置。
              </p>
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">選擇適當的模式來顯示音階位置</p>
                <div className="flex flex-wrap gap-2">
                  {["Position 1", "Position 2", "Position 3", "Position 4", "Position 5", "Position 6", "Position 7"].map((pattern, index) => (
                    <button 
                      key={pattern} 
                      onClick={() => handlePatternToggle(index)}
                      className={`flex-1 px-3 py-2 rounded-md font-medium 
                        ${activePatterns.includes(index) 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border">
              <GuitarFretboard 
                currentKey={currentKey} 
                patterns={activePatterns} 
                patternType={patternType}
                useNumberNotation={useNumberNotation} 
              />
            </div>
          </div>
        )}

        {currentTab === "CAGED" && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">CAGED音階模式</h2>
              <p className="text-gray-600 mb-4">
                CAGED系統是以五個基本和弦形狀（C、A、G、E、D）延伸出的音階模式。
              </p>
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">選擇適當的模式來顯示音階位置</p>
                <div className="flex flex-wrap gap-2">
                  {["C形", "A形", "G形", "E形", "D形"].map((pattern, index) => (
                    <button 
                      key={pattern} 
                      onClick={() => handlePatternToggle(index)}
                      className={`flex-1 px-3 py-2 rounded-md font-medium 
                        ${activePatterns.includes(index) 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border">
              <GuitarFretboard 
                currentKey={currentKey} 
                patterns={activePatterns} 
                patternType={patternType} 
                useNumberNotation={useNumberNotation}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
