"use client";

import { useEffect, useMemo, useRef } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  contentWidth: number;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  syncEnabled: boolean;
  scrollRatio: number;
  onScrollRatioChange: (ratio: number) => void;
}

export function MarkdownEditor({
  value,
  onChange,
  contentWidth,
  fontSize,
  lineHeight,
  fontFamily,
  syncEnabled,
  scrollRatio,
  onScrollRatioChange,
}: MarkdownEditorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const syncingRef = useRef(false);

  const editorTheme = useMemo(
    () =>
      EditorView.theme({
        "&": { height: "100%" },
        ".cm-scroller": { overflow: "auto" },
        ".cm-content": {
          maxWidth: `${contentWidth}px`,
          margin: "0 auto",
          fontSize: `${fontSize}px`,
          lineHeight: String(lineHeight),
          fontFamily,
          paddingTop: "8px",
          paddingBottom: "20px",
        },
      }),
    [contentWidth, fontFamily, fontSize, lineHeight],
  );

  useEffect(() => {
    const scroller = rootRef.current?.querySelector(".cm-scroller") as HTMLElement | null;
    if (!scroller) {
      return;
    }

    const handleScroll = () => {
      if (syncingRef.current) {
        return;
      }
      if (!syncEnabled) {
        return;
      }
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      const nextRatio = maxScroll > 0 ? scroller.scrollTop / maxScroll : 0;
      onScrollRatioChange(Math.max(0, Math.min(1, nextRatio)));
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [onScrollRatioChange, syncEnabled]);

  useEffect(() => {
    if (!syncEnabled) {
      return;
    }
    const scroller = rootRef.current?.querySelector(".cm-scroller") as HTMLElement | null;
    if (!scroller) {
      return;
    }
    const maxScroll = scroller.scrollHeight - scroller.clientHeight;
    const nextTop = maxScroll * scrollRatio;
    syncingRef.current = true;
    scroller.scrollTop = nextTop;
    requestAnimationFrame(() => {
      syncingRef.current = false;
    });
  }, [scrollRatio, syncEnabled]);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">Markdown</header>
      <div className="min-h-0 flex-1 overflow-auto" ref={rootRef}>
        <CodeMirror
          value={value}
          extensions={[markdown(), EditorView.lineWrapping, editorTheme]}
          height="100%"
          onChange={onChange}
          basicSetup={{
            foldGutter: false,
            highlightActiveLine: true,
            lineNumbers: true,
          }}
          theme="light"
        />
      </div>
    </section>
  );
}
