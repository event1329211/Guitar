import { useState, useEffect, useRef } from 'react';

interface Note {
  note: string;
  octave: number;
  string?: number;
  fret?: number;
  patternIndex?: number; // 添加模式索引以追踪音符所屬模式
}

interface Pattern3NPS {
  name: string;
  positions: (number | null)[][];
  color: string; // 添加顏色屬性
}

interface PatternCAGED {
  name: string;
  positions: (number | null)[][];
  color: string;
}

const VIEWBOX_WIDTH = 3000;
const VIEWBOX_HEIGHT = 700;

// 所有可能的調性
const ALL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 添加顏色定義到每個模式
const PATTERNS_3NPS: Pattern3NPS[] = [
  {
    name: "Position 1",
    positions: [
      [3, 5, 7],    // 第1弦 (E弦) 品格位置
      [3, 5, 6],    // 第2弦 (B弦) 品格位置
      [2, 4, 5],    // 第3弦 (G弦) 品格位置
      [2, 3, 5],    // 第4弦 (D弦) 品格位置
      [2, 3, 5],    // 第5弦 (A弦) 品格位置
      [1, 3, 5]     // 第6弦 (E弦) 品格位置
    ],
    color: "#FF5252" // 紅色
  },
  {
    name: "Position 2",
    positions: [
      [5, 7, 8],   // 第1弦
      [5, 6, 8],   // 第2弦
      [4, 5, 7],   // 第3弦
      [3, 5, 7],   // 第4弦
      [3, 5, 7],   // 第5弦
      [3, 5, 7]    // 第6弦
    ],
    color: "#FF9800" // 橙色
  },
  {
    name: "Position 3",
    positions: [
      [7, 8, 10], // 第1弦
      [6, 8, 10], // 第2弦
      [5, 7, 9],  // 第3弦
      [5, 7, 9],  // 第4弦
      [5, 7, 8], // 第5弦
      [5, 7, 8]  // 第6弦
    ],
    color: "#FFC107" // 深黃色
  },
  {
    name: "Position 4",
    positions: [
      [8, 10, 12], // 第1弦
      [8, 10, 12], // 第2弦
      [7, 9, 10], // 第3弦
      [7, 9, 10], // 第4弦
      [7, 8, 10], // 第5弦
      [7, 8, 10]  // 第6弦
    ],
    color: "#4CAF50" // 綠色
  },
  {
    name: "Position 5",
    positions: [
      [10, 12, 13], // 第1弦
      [10, 12, 13], // 第2弦
      [9, 10, 12], // 第3弦
      [9, 10, 12], // 第4弦
      [8, 10, 12], // 第5弦
      [8, 10, 12]  // 第6弦
    ],
    color: "#2196F3" // 藍色
  },
  {
    name: "Position 6",
    positions: [
      [12, 13, 15], // 第1弦
      [12, 13, 15], // 第2弦
      [10, 12, 14], // 第3弦
      [10, 12, 14], // 第4弦
      [10, 12, 14], // 第5弦
      [10, 12, 13]  // 第6弦
    ],
    color: "#673AB7" // 紫色
  },
  {
    name: "Position 7",
    positions: [
      [13, 15, 17],    // 第1弦
      [13, 15, 17],    // 第2弦
      [12, 14, 16],    // 第3弦
      [12, 14, 15],    // 第4弦
      [12, 14, 15],    // 第5弦
      [12, 13, 15]     // 第6弦
    ],
    color: "#9C27B0" // 深紫色
  }
];

// 定義CAGED模式
const PATTERNS_CAGED: PatternCAGED[] = [
  {
    name: "C形",
    positions: [
      [12, 13, 15],    // 第1弦 (E弦)
      [12, 13, 15],    // 第2弦 (B弦)
      [12, 14],    // 第3弦 (G弦)
      [12, 14, 15],       // 第4弦 (D弦)
      [12, 14, 15],       // 第5弦 (A弦) 
      [12, 13,15]         // 第6弦 (E弦)
    ],
    color: "#FF5252" // 紅色
  },
  {
    name: "A形",
    positions: [
      [3, 5],    // 第1弦 (E弦)
      [3, 5, 6],    // 第2弦 (B弦)
      [2, 4, 5],    // 第3弦 (G弦)
      [2, 3, 5],       // 第4弦 (D弦)
      [2, 3, 5],       // 第5弦 (A弦) 
      [3, 5]      // 第6弦
    ],
    color: "#FF9800" // 橙色
  },
  {
    name: "G形",
    positions: [
      [5, 7,8],       // 第1弦
      [5, 6,8],       // 第2弦
      [4, 5, 7],    // 第3弦
      [5, 7],    // 第4弦
      [5, 7, 8],    // 第5弦
      [5, 7, 8]        // 第6弦
    ],
    color: "#FFC107" // 深黃色
  },
  {
    name: "E形",
    positions: [
      [7, 8, 10],    // 第1弦
      [8, 10],    // 第2弦
      [7, 9,10],       // 第3弦
      [7, 9,10],       // 第4弦
      [7, 8,10],       // 第5弦
      [7, 8, 10]     // 第6弦
    ],
    color: "#4CAF50" // 綠色
  },
  {
    name: "D形",
    positions: [
      [10, 12,13],     // 第1弦
      [10, 12,13],     // 第2弦
      [9, 10,12],     // 第3弦
      [9, 10,12],     // 第4弦
      [10, 12],     // 第5弦
      [10, 12,13]      // 第6弦
    ],
    color: "#2196F3" // 藍色
  }
];

// 接收 props 以支持從父組件接收調性和模式
interface GuitarFretboardProps {
  currentKey?: string;
  patterns?: number[];
  noteMode?: boolean; // 音符模式屬性
  allNotesMode?: boolean; // 全音符模式屬性
  patternType?: "3NPS" | "CAGED"; // 添加模式類型屬性
  useNumberNotation?: boolean; // 是否使用數字記譜法
  scaleType?: "major" | "minor" | "pentatonic" | "dorian" | "phrygian" | "lydian" | "mixolydian" | "locrian"; // 音階類型
}

const GuitarFretboard = ({ 
  currentKey = 'C', 
  patterns = [], 
  noteMode = false,
  allNotesMode = false,
  patternType = "3NPS",
  useNumberNotation = false,
  scaleType = "major"
}: GuitarFretboardProps) => {
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
  const [activePatterns, setActivePatterns] = useState<number[]>(patterns);
  
  const svgRef = useRef<SVGSVGElement>(null);
  
  const strings = ['E', 'B', 'G', 'D', 'A', 'E'];
  const frets = Array.from({ length: 24 }, (_, i) => i);
  const fretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
  const doubleMarkers = [12, 24]; // 12格和24格顯示兩個點
  
  // 添加一個函數將升記號音符轉換為降記號表示
  const sharpsToFlats = (note: string): string => {
    const sharps = ['C#', 'D#', 'F#', 'G#', 'A#'];
    const flats = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];
    
    const index = sharps.indexOf(note);
    if (index !== -1) {
      return flats[index];
    }
    return note;
  };

  const getNoteAtPosition = (stringIndex: number, fret: number): Note => {
    const notes = ALL_KEYS;
    const openStringNote = strings[stringIndex];
    const openStringIndex = notes.indexOf(openStringNote);
    const noteIndex = (openStringIndex + fret) % 12;
    const octave = Math.floor((openStringIndex + fret) / 12) + 4;
    
    return {
      note: notes[noteIndex],
      octave,
      string: stringIndex,
      fret
    };
  };

  // 生成3NPS模式的音符，增加 patternIndex 參數
  const generate3NPSNotes = (key: string, patternIndex: number): Note[] => {
    if (patternIndex < 0 || patternIndex >= PATTERNS_3NPS.length) return [];
    
    const pattern = PATTERNS_3NPS[patternIndex];
    const notes: Note[] = [];
    
    // 根據當前調性，選擇一個合適的起始品格位置
    const keyIndex = ALL_KEYS.indexOf(key);
    const cKeyIndex = ALL_KEYS.indexOf('C');
    const offset = (keyIndex - cKeyIndex + 12) % 12; // C調到當前調的半音距離
    
    // 計算每條弦上的音符
    strings.forEach((_, stringIndex) => {
      const stringFrets = pattern.positions[stringIndex];
      
      stringFrets.forEach(fret => {
        if (fret === null) return; // 跳過空位置
        
        // 根據當前調性調整品格位置
        const adjustedFret = (fret + offset) % 24;
        if (adjustedFret < 0 || adjustedFret >= 24) return; // 確保在吉他範圍內
        
        const note = getNoteAtPosition(stringIndex, adjustedFret);
        note.patternIndex = patternIndex; // 設置音符所屬模式
        notes.push(note);
      });
    });
    
    return notes;
  };

  // 生成CAGED模式的音符
  const generateCAGEDNotes = (key: string, patternIndex: number): Note[] => {
    if (patternIndex < 0 || patternIndex >= PATTERNS_CAGED.length) return [];
    
    const pattern = PATTERNS_CAGED[patternIndex];
    const notes: Note[] = [];
    
    // 根據當前調性計算偏移量
    const keyIndex = ALL_KEYS.indexOf(key);
    const cKeyIndex = ALL_KEYS.indexOf('C');
    const offset = (keyIndex - cKeyIndex + 12) % 12; // C調到當前調的半音距離
    
    // 計算每條弦上的音符
    strings.forEach((_, stringIndex) => {
      const stringFrets = pattern.positions[stringIndex];
      
      stringFrets.forEach(fret => {
        if (fret === null) return; // 跳過空位置
        
        // 根據當前調性調整品格位置
        const adjustedFret = (fret + offset) % 24;
        if (adjustedFret < 0 || adjustedFret >= 24) return; // 確保在吉他範圍內
        
        const note = getNoteAtPosition(stringIndex, adjustedFret);
        note.patternIndex = patternIndex; // 設置音符所屬模式
        notes.push(note);
      });
    });
    
    return notes;
  };

  // 生成指定音符在全指板上的所有位置
  const generateAllNotesOfType = (noteName: string): Note[] => {
    const notes: Note[] = [];
    
    strings.forEach((_, stringIndex) => {
      frets.forEach(fret => {
        const note = getNoteAtPosition(stringIndex, fret);
        if (note.note === noteName) {
          notes.push({
            ...note,
            string: stringIndex,
            fret
          });
        }
      });
    });
    
    return notes;
  };

  // 根據音階類型獲取音程間隔
  const getScaleIntervals = (type: string): number[] => {
    switch(type) {
      case "major": // 大調/Ionian
        return [0, 2, 4, 5, 7, 9, 11]; // 全全半全全全半
      case "minor": // 自然小調/Aeolian
        return [0, 2, 3, 5, 7, 8, 10]; // 全半全全半全全
      case "pentatonic": // 大調五聲音階
        return [0, 2, 4, 7, 9]; // 去掉4和7音級的大調
      case "dorian": // 多利安
        return [0, 2, 3, 5, 7, 9, 10]; // 全半全全全半全
      case "phrygian": // 弗里幾亞
        return [0, 1, 3, 5, 7, 8, 10]; // 半全全全半全全
      case "lydian": // 利迪亞
        return [0, 2, 4, 6, 7, 9, 11]; // 全全全半全全半
      case "mixolydian": // 混合利迪亞
        return [0, 2, 4, 5, 7, 9, 10]; // 全全半全全半全
      case "locrian": // 洛克利安
        return [0, 1, 3, 5, 6, 8, 10]; // 半全全半全全全
      default:
        return [0, 2, 4, 5, 7, 9, 11]; // 默認大調
    }
  };

  // 生成調性中的所有音符
  const generateAllScaleNotes = (key: string): Note[] => {
    const notes: Note[] = [];
    // 獲取當前選擇的音階的音程間隔
    const scaleIntervals = getScaleIntervals(scaleType);
    
    const keyIndex = ALL_KEYS.indexOf(key);
    
    // 為每個弦上的每個品格檢查音符
    strings.forEach((_, stringIndex) => {
      frets.forEach(fret => {
        const note = getNoteAtPosition(stringIndex, fret);
        const noteIndex = ALL_KEYS.indexOf(note.note);
        
        // 檢查此音符是否屬於當前選擇的音階
        const relativeIndex = (noteIndex - keyIndex + 12) % 12;
        if (scaleIntervals.includes(relativeIndex)) {
          notes.push({
            ...note,
            string: stringIndex,
            fret
          });
        }
      });
    });
    
    return notes;
  };

  // 更新所有選中模式的音符
  const updateSelectedNotes = (patterns: number[], key: string) => {
    if (noteMode) {
      // 在音符模式下，顯示所有相同音符的位置
      setSelectedNotes(generateAllNotesOfType(key));
      return;
    }
    
    if (allNotesMode) {
      // 在全音符模式下，顯示當前調的所有音符
      setSelectedNotes(generateAllScaleNotes(key));
      return;
    }
    
    if (patterns.length === 0) {
      setSelectedNotes([]);
      return;
    }
    
    // 生成所有選中模式的音符
    let allNotes: Note[] = [];
    patterns.forEach(patternIndex => {
      let notes: Note[] = [];
      
      // 根據模式類型選擇不同的生成函數
      if (patternType === "3NPS") {
        notes = generate3NPSNotes(key, patternIndex);
      } else if (patternType === "CAGED") {
        notes = generateCAGEDNotes(key, patternIndex);
      }
      
      allNotes = [...allNotes, ...notes];
    });
    
    setSelectedNotes(allNotes);
  };

  const handleNoteClick = (stringIndex: number, fret: number) => {
    const note = getNoteAtPosition(stringIndex, fret);
    const isSelected = selectedNotes.some(n => n.string === stringIndex && n.fret === fret);
    
    if (isSelected) {
      setSelectedNotes(prev => prev.filter(n => !(n.string === stringIndex && n.fret === fret)));
    } else {
      setSelectedNotes(prev => [...prev, { ...note, string: stringIndex, fret }]);
    }
  };

  const getNoteColor = (note: Note): string => {
    if (note.patternIndex !== undefined) {
      // 根據模式類型選擇不同的顏色來源
      if (patternType === "3NPS") {
        return PATTERNS_3NPS[note.patternIndex].color;
      } else if (patternType === "CAGED") {
        return PATTERNS_CAGED[note.patternIndex].color;
      }
    }
    return "#3b82f6"; // 默認藍色
  };

  // 將音符轉換為音階數字
  const getNoteNumber = (note: string): string => {
    const keyIndex = ALL_KEYS.indexOf(currentKey);
    const noteIndex = ALL_KEYS.indexOf(note);
    
    // 獲取當前選擇的音階的音程間隔
    const scaleIntervals = getScaleIntervals(scaleType);
    
    // 計算相對於當前調的半音距離
    const relativeIndex = (noteIndex - keyIndex + 12) % 12;
    
    // 查找此音符在音階中的位置
    const degreeIndex = scaleIntervals.indexOf(relativeIndex);
    
    if (degreeIndex === -1) {
      // 如果音符不在音階中，顯示降記標記而不是升記
      // 尋找最接近的音階音（高於當前音符的下一個音階音）
      const higherInterval = Math.min(...scaleIntervals.filter(i => i > relativeIndex).concat([scaleIntervals[0] + 12]));
      const higherDegree = scaleIntervals.indexOf(higherInterval % 12) + 1;
      return `♭${higherDegree}`;
    }
    
    // 返回音階度數（從1開始）
    return (degreeIndex + 1).toString();
  };

  // 檢查音符是否為主音(一度)
  const isRootNote = (note: Note): boolean => {
    const keyIndex = ALL_KEYS.indexOf(currentKey);
    const noteIndex = ALL_KEYS.indexOf(note.note);
    
    // 主音是當前調的一度音
    return noteIndex === keyIndex;
  };

  const drawFretboard = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    // 直接用 viewBox 的座標系
    const width = VIEWBOX_WIDTH;
    const height = VIEWBOX_HEIGHT;
    // 總共25個區域：空弦區域 + 24個品格
    const fretWidth = width / 25;
    const stringSpacing = height / (strings.length + 1);

    // 清空 SVG
    svg.innerHTML = '';

    // 繪製指版背景
    const fretboard = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fretboard.setAttribute('x', '0');
    fretboard.setAttribute('y', '0');
    fretboard.setAttribute('width', width.toString());
    fretboard.setAttribute('height', height.toString());
    fretboard.setAttribute('fill', '#8B4513');
    svg.appendChild(fretboard);

    // 繪製空弦位置（黑色區域）
    const nutArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    nutArea.setAttribute('x', '0');
    nutArea.setAttribute('y', '0');
    nutArea.setAttribute('width', fretWidth.toString());
    nutArea.setAttribute('height', height.toString());
    nutArea.setAttribute('fill', '#000000');
    svg.appendChild(nutArea);

    // 繪製品格線
    frets.forEach((fret) => {
      const fretLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const x = (fret + 1) * fretWidth; // 第一條線在空弦區域之後
      fretLine.setAttribute('x1', x.toString());
      fretLine.setAttribute('y1', '0');
      fretLine.setAttribute('x2', x.toString());
      fretLine.setAttribute('y2', height.toString());
      fretLine.setAttribute('stroke', '#000');
      fretLine.setAttribute('stroke-width', '8');
      svg.appendChild(fretLine);
    });

    // 繪製琴弦
    strings.forEach((string, index) => {
      const y = (index + 1) * stringSpacing;
      
      // 繪製弦
      const stringLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      stringLine.setAttribute('x1', '0');
      stringLine.setAttribute('y1', y.toString());
      stringLine.setAttribute('x2', width.toString());
      stringLine.setAttribute('y2', y.toString());
      stringLine.setAttribute('stroke', '#CCC');
      stringLine.setAttribute('stroke-width', '6');
      svg.appendChild(stringLine);
      
      // 顯示弦名稱
      const stringText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      stringText.setAttribute('x', '10'); // 左側位置
      stringText.setAttribute('y', y.toString());
      stringText.setAttribute('dominant-baseline', 'middle');
      stringText.setAttribute('fill', '#FFF');
      stringText.setAttribute('font-size', '20');
      stringText.textContent = string;
      svg.appendChild(stringText); // 顯示弦名
    });

    // 繪製品格標記
    fretMarkers.forEach(fret => {
      if (fret <= frets.length) {
        // 品格點應該居中於品格中
        const x = fretWidth * fret + fretWidth / 2;
        
        if (doubleMarkers.includes(fret)) {
          // 雙點標記 (12格和24格)
          const marker1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          marker1.setAttribute('cx', x.toString());
          marker1.setAttribute('cy', (stringSpacing * 1.5).toString()); // 第1和第2弦之間
          marker1.setAttribute('r', '32');
          marker1.setAttribute('fill', '#FFF');
          svg.appendChild(marker1);
          
          const marker2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          marker2.setAttribute('cx', x.toString());
          marker2.setAttribute('cy', (stringSpacing * 4.5).toString()); // 第4和第5弦之間
          marker2.setAttribute('r', '32');
          marker2.setAttribute('fill', '#FFF');
          svg.appendChild(marker2);
        } else {
          // 單點標記
          const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          marker.setAttribute('cx', x.toString());
          marker.setAttribute('cy', (height / 2).toString());
          marker.setAttribute('r', '32');
          marker.setAttribute('fill', '#FFF');
          svg.appendChild(marker);
        }
      }
    });

    // 繪製音符點
    strings.forEach((_, stringIndex) => {
      frets.forEach((fret) => {
        const note = getNoteAtPosition(stringIndex, fret);
        const isSelected = selectedNotes.some(
          n => n.string === stringIndex && n.fret === fret
        );

        if (isSelected) {  // 只繪製被選中的音符
          // 獲取此位置的所有選中音符（可能來自不同模式）
          const notesAtPosition = selectedNotes.filter(
            n => n.string === stringIndex && n.fret === fret
          );
          
          // 使用找到的第一個音符的顏色
          let noteColor = getNoteColor(notesAtPosition[0]);
          
          // 計算音符點的位置，確保在品格中間
          const x = fret === 0 
            ? fretWidth / 2  // 空弦位於黑色區域中央
            : fretWidth * fret + fretWidth / 2;  // 其他品格位於品格中央
          const y = (stringIndex + 1) * stringSpacing;

          // 為主音使用亮版顏色
          if (isRootNote(note)) {
            // 將原色調亮為亮色版本
            const lightColor = lightenColor(noteColor, 0.7); // 函數將在後面定義
            noteColor = lightColor;
          }

          const noteDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          noteDot.setAttribute('cx', x.toString());
          noteDot.setAttribute('cy', y.toString());
          noteDot.setAttribute('r', '45'); // 音符圓圈
          noteDot.setAttribute('fill', noteColor);
          
          // 為主音添加白色外框
          if (isRootNote(note)) {
            noteDot.setAttribute('stroke', '#FFFFFF'); // 白色外框
            noteDot.setAttribute('stroke-width', '5');
          } else {
            noteDot.setAttribute('stroke', '#000000'); // 其他音符仍使用黑色外框
            noteDot.setAttribute('stroke-width', '3');
          }
          
          noteDot.style.cursor = 'pointer';
          noteDot.onclick = () => handleNoteClick(stringIndex, fret);

          const noteText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          noteText.setAttribute('x', x.toString());
          noteText.setAttribute('y', y.toString());
          noteText.setAttribute('text-anchor', 'middle');
          noteText.setAttribute('dominant-baseline', 'middle');
          noteText.setAttribute('font-size', '38');
          noteText.setAttribute('font-weight', 'bold');
          noteText.setAttribute('pointer-events', 'none'); // 防止文字捕獲點擊事件
          
          // 根據記譜法選項設置顯示的文字
          if (useNumberNotation) {
            noteText.textContent = getNoteNumber(note.note);
          } else {
            // 使用降記號表示法顯示音符
            noteText.textContent = sharpsToFlats(note.note);
          }

          // 主音使用深色文字，其他音符使用白色
          if (isRootNote(note)) {
            noteText.setAttribute('font-weight', '900');
            noteText.setAttribute('fill', '#000000'); // 深色文字
          } else {
            noteText.setAttribute('fill', '#FFFFFF'); // 其他音符仍使用白色文字
          }

          svg.appendChild(noteDot);
          svg.appendChild(noteText);
        } else {
          // 為未選中的音符添加點擊事件區域，位置也是品格中央
          const x = fret === 0 
            ? fretWidth / 2
            : fretWidth * fret + fretWidth / 2;
          const y = (stringIndex + 1) * stringSpacing;
          
          const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          hitArea.setAttribute('cx', x.toString());
          hitArea.setAttribute('cy', y.toString());
          hitArea.setAttribute('r', '45');
          hitArea.setAttribute('fill', 'transparent');
          hitArea.style.cursor = 'pointer';
          hitArea.onclick = () => handleNoteClick(stringIndex, fret);
          svg.appendChild(hitArea);
        }
      });
    });
  };

  // 移除舊的暗色版函數，改為亮色版函數
  const lightenColor = (hexColor: string, factor: number): string => {
    // 移除#並轉換為RGB
    let hex = hexColor.replace('#', '');
    
    // 處理縮寫形式
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // 轉換為RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // 增加RGB值以使顏色變亮，但不超過255
    const lighterR = Math.min(255, Math.floor(r + (255 - r) * factor));
    const lighterG = Math.min(255, Math.floor(g + (255 - g) * factor));
    const lighterB = Math.min(255, Math.floor(b + (255 - b) * factor));
    
    // 轉回十六進制格式
    return `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;
  };

  // 監聽 props 變化
  useEffect(() => {
    updateSelectedNotes(activePatterns, currentKey);
  }, [currentKey, noteMode, allNotesMode, patternType, scaleType]);

  useEffect(() => {
    // 初始化畫面或當 patterns prop 變化時
    if (JSON.stringify(patterns) !== JSON.stringify(activePatterns)) {
      setActivePatterns(patterns);
      updateSelectedNotes(patterns, currentKey);
    }
  }, [patterns, currentKey, patternType, allNotesMode, scaleType]);

  useEffect(() => {
    drawFretboard();
  }, [selectedNotes]);

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        className="w-full min-h-[700px]"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default GuitarFretboard; 