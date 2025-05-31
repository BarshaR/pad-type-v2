"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Editor from "@monaco-editor/react";

export default function TypeTest() {
  const typingEditorRef = useRef<any>(null);
  const typingEditorMonacoRef = useRef<any>(null);
  const passageEditorRef = useRef<any>(null);
  const passageEditorMonacoRef = useRef<any>(null);
  const [code, setCode] = useState<string>("");
  const [testPassage, setTestPassage] = useState<string>(
    "// Loading test passage..."
  );
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0); // seconds
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [selectedPassage, setSelectedPassage] = useState<string>("0");
  const passages: { label: string; value: string; code: string }[] = [
    {
      label: "Hello World",
      value: "0",
      code: `console.log('Hello, world!');`,
    },
    {
      label: "Add Function",
      value: "1",
      code: `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));`,
    },
    {
      label: "Factorial",
      value: "2",
      code: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(5));`,
    },
    {
      label: "FizzBuzz",
      value: "3",
      code: `for (let i = 1; i <= 15; i++) {\n  let out = '';\n  if (i % 3 === 0) out += 'Fizz';\n  if (i % 5 === 0) out += 'Buzz';\n  console.log(out || i);\n}`,
    },
    {
      label: "Reverse String",
      value: "4",
      code: `function reverse(str) {\n  return str.split('').reverse().join('');\n}\nconsole.log(reverse('hello'));`,
    },
  ];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Start timer on first keystroke
  const startTimer = () => {
    if (!timerActive) {
      setTimerActive(true);
      startTimeRef.current = Date.now();
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer(
          Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000)
        );
      }, 1000);
    }
  };

  // Stop timer and reset state
  const stopTimer = () => {
    setTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // On mount, set the initial passage and mark as NOT complete (so typing is enabled immediately)
  useEffect(() => {
    setTestPassage(passages[0].code);
    setSelectedPassage(passages[0].value);
    setIsComplete(false); // allow typing on load
  }, []);

  // Reset timer, code, mistakes, wpm when passage changes
  useEffect(() => {
    setTimer(0);
    setTimerActive(false);
    setCode("");
    setMistakeCount(0);
    setWpm(0);
    setIsComplete(false); // allow typing after passage change
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
  }, [testPassage]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handlePassageEditorDidMount = (inEditor: any, inMonaco: any) => {
    passageEditorRef.current = inEditor;
    passageEditorMonacoRef.current = inMonaco;
    setTestPassage(
      "console.log('Hello, world!');\n\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\nconsole.log(add(5, 10));"
    );
  };

  const handleEditorDidMount = (inEditor: any, inMonaco: any) => {
    typingEditorRef.current = inEditor;
    typingEditorMonacoRef.current = inMonaco;
    console.log("Editor mounted:", typingEditorRef.current);
    // Set the initial value of the editor
  };

  const handleRestart = () => {
    setCode("");
    setMistakeCount(0);
    setTimer(0);
    setWpm(0);
    setIsComplete(false); // allow passage selection and typing after restart
    setTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
    typingEditorRef.current?.setValue("");
    typingEditorRef.current?.updateOptions({ readOnly: false });
  };

  const handlePassageSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPassage(e.target.value);
    setTestPassage(
      passages.find((p) => p.value === e.target.value)?.code || ""
    );
  };

  const handleStop = () => {
    stopTimer();
    setIsComplete(true);
    typingEditorRef.current?.updateOptions({ readOnly: true });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (
      value === undefined ||
      !typingEditorRef.current ||
      !typingEditorMonacoRef.current
    )
      return;

    if (!timerActive && value.length > 0) {
      startTimer();
    }

    setCode(value);

    // Count mistakes
    let mistakes = 0;
    const minLen = Math.min(value.length, testPassage.length);
    for (let i = 0; i < minLen; i++) {
      if (value[i] !== testPassage[i]) {
        mistakes++;
      }
    }
    if (value.length > testPassage.length) {
      mistakes += value.length - testPassage.length;
    }
    setMistakeCount(mistakes);

    // Calculate WPM (words per minute)
    // WPM = (characters typed / 5) / (minutes elapsed)
    // Only count correct characters up to the current input length
    let correctChars = 0;
    for (let i = 0; i < minLen; i++) {
      if (value[i] === testPassage[i]) correctChars++;
    }
    let elapsedSeconds = 0;
    if (startTimeRef.current) {
      elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
    }
    const minutes = elapsedSeconds > 0 ? elapsedSeconds / 60 : 1 / 60;
    const wpmValue =
      elapsedSeconds >= 1 ? Math.round(correctChars / 5 / minutes) : 0;
    setWpm(wpmValue);

    // If exact match, stop timer, no highlight, disable editor
    if (value === testPassage) {
      typingEditorRef.current.deltaDecorations([], []);
      stopTimer();
      setIsComplete(true);
      typingEditorRef.current.updateOptions({ readOnly: true });
      alert(
        `You have completed the test! Time: ${timer} seconds | WPM: ${wpm}`
      );
      return;
    }

    const model = typingEditorRef.current.getModel();
    let decorations = [];
    for (let i = 0; i < minLen; i++) {
      const startPos = model.getPositionAt(i);
      const endPos = model.getPositionAt(i + 1);
      if (value[i] === testPassage[i]) {
        decorations.push({
          range: new typingEditorMonacoRef.current.Range(
            startPos.lineNumber,
            startPos.column,
            endPos.lineNumber,
            endPos.column
          ),
          options: {
            inlineClassName: "myInlineCorrect",
            stickiness:
              typingEditorMonacoRef.current.editor.TrackedRangeStickiness
                .AlwaysGrowsWhenTypingAtEdges,
          },
        });
      } else {
        decorations.push({
          range: new typingEditorMonacoRef.current.Range(
            startPos.lineNumber,
            startPos.column,
            endPos.lineNumber,
            endPos.column
          ),
          options: {
            inlineClassName: "myInlineHighlight",
            stickiness:
              typingEditorMonacoRef.current.editor.TrackedRangeStickiness
                .AlwaysGrowsWhenTypingAtEdges,
          },
        });
      }
    }
    if (value.length > testPassage.length) {
      const startPos = model.getPositionAt(testPassage.length);
      const endPos = model.getPositionAt(value.length);
      decorations.push({
        range: new typingEditorMonacoRef.current.Range(
          startPos.lineNumber,
          startPos.column,
          endPos.lineNumber,
          endPos.column
        ),
        options: {
          inlineClassName: "myInlineHighlight",
          stickiness:
            typingEditorMonacoRef.current.editor.TrackedRangeStickiness
              .AlwaysGrowsWhenTypingAtEdges,
        },
      });
    }
    typingEditorRef.current.deltaDecorations([], decorations);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "row", position: "relative" }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <label htmlFor="passage-select" style={{ fontWeight: 500 }}>
            Choose passage:
          </label>
          <select
            id="passage-select"
            value={selectedPassage}
            onChange={handlePassageSelect}
            disabled={timerActive}
            style={{ padding: 6, fontSize: 16, borderRadius: 4 }}
          >
            {passages.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          {timerActive && (
            <button
              onClick={handleStop}
              style={{
                marginLeft: 16,
                padding: "6px 18px",
                fontSize: 16,
                borderRadius: 4,
                background: "#c00",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Stop
            </button>
          )}
        </div>
        <Editor
          height="500px"
          width="100%"
          defaultLanguage="javascript"
          value={testPassage}
          // onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: true },
            wordWrap: "on",
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
          }}
          onMount={handlePassageEditorDidMount}
        />
        <Editor
          height="500px"
          width="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            readOnly: isComplete,
            minimap: { enabled: true },
            wordWrap: "on",
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            tabSize: 2,
          }}
          onMount={handleEditorDidMount}
        />
      </div>
      <div
        style={{
          width: 200,
          marginLeft: 24,
          padding: 16,
          background: "#181818",
          color: "#fff",
          borderRadius: 8,
          height: "fit-content",
        }}
      >
        <h3>Mistakes</h3>
        <div
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: mistakeCount > 0 ? "#ff3333" : "#00c800",
          }}
        >
          {mistakeCount}
        </div>
        <h3 style={{ marginTop: 32 }}>Timer</h3>
        <div style={{ fontSize: 32, fontWeight: "bold" }}>{timer}s</div>
        <h3 style={{ marginTop: 32 }}>WPM</h3>
        <div style={{ fontSize: 32, fontWeight: "bold" }}>{wpm}</div>
      </div>
      <button
        onClick={handleRestart}
        disabled={!isComplete}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          padding: "14px 32px",
          fontSize: 20,
          borderRadius: 8,
          background: "#222",
          color: "#fff",
          border: "none",
          cursor: isComplete ? "pointer" : "not-allowed",
          opacity: isComplete ? 1 : 0.5,
          zIndex: 1000,
        }}
      >
        Restart Test
      </button>
      <style jsx global>{`
        .myInlineHighlight {
          background-color: rgba(255, 0, 0, 0.3);
          border-radius: 2px;
        }
        .myInlineCorrect {
          background-color: rgba(0, 200, 0, 0.2);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
