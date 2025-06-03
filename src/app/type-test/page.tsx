"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Editor from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import type { editor } from "monaco-editor";
import { passages } from "./passages";
import { ControlsBar } from "./ControlsBar";
import { StatsPanel } from "./StatsPanel";

export default function TypeTest() {
  const typingEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const typingEditorMonacoRef = useRef<typeof monaco | null>(null);
  const passageEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const passageEditorMonacoRef = useRef<typeof monaco | null>(null);
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

  const handlePassageEditorDidMount = (
    inEditor: editor.IStandaloneCodeEditor,
    inMonaco: typeof monaco
  ) => {
    passageEditorRef.current = inEditor;
    passageEditorMonacoRef.current = inMonaco;
    setTestPassage(
      "console.log('Hello, world!');\n\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\nconsole.log(add(5, 10));"
    );
  };

  const handleEditorDidMount = (
    inEditor: editor.IStandaloneCodeEditor,
    inMonaco: typeof monaco
  ) => {
    typingEditorRef.current = inEditor;
    typingEditorMonacoRef.current = inMonaco;
    // Prevent paste in the typing editor
    inEditor.onKeyDown((e: monaco.IKeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyV") {
        e.preventDefault();
        window.alert(
          "Nice try! Copy-pasting is disabled. Your fingers need the workout! 🏋️‍♂️"
        );
      }
    });
    // Fallback for browsers: block paste event at DOM level
    const domNode = inEditor.getDomNode();
    if (domNode) {
      domNode.addEventListener("paste", (e: ClipboardEvent) => {
        e.preventDefault();
        window.alert(
          "Nice try! Copy-pasting is disabled. Your fingers need the workout! 🏋️‍♂️"
        );
        return false;
      });
    }
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

    // Highlight per-character mistakes
    const model = typingEditorRef.current.getModel();
    if (!model) return;
    const decorations = [];
    for (let i = 0; i < value.length; i++) {
      const startPos = model.getPositionAt(i);
      const endPos = model.getPositionAt(i + 1);
      if (i < testPassage.length) {
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
          // Highlight mistakes in red
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
      } else {
        // Extra characters beyond passage are also mistakes
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
    typingEditorRef.current.deltaDecorations([], decorations);
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        position: "relative",
        padding: 32,
        gap: 32,
        height: "100vh - 36px",
        background: "#202124",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ControlsBar
          passages={passages}
          selectedPassage={selectedPassage}
          onSelect={handlePassageSelect}
          timerActive={timerActive}
          onStop={handleStop}
          onRestart={handleRestart}
          isComplete={isComplete}
        />
        <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
          <div
            className="editor-wrapper"
            style={{ flex: 1, minWidth: 0, paddingRight: 16 }}
          >
            <Editor
              height="50%"
              width="100%"
              defaultLanguage="javascript"
              value={testPassage}
              // onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                wordWrap: "on",
                fontSize: 16,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
              }}
              onMount={handlePassageEditorDidMount}
            />
            <Editor
              height="50%"
              width="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                readOnly: isComplete,
                minimap: { enabled: false },
                wordWrap: "on",
                fontSize: 16,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                tabSize: 2,
              }}
              onMount={handleEditorDidMount}
            />
          </div>
          <StatsPanel mistakeCount={mistakeCount} timer={timer} wpm={wpm} />
        </div>
      </div>
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
