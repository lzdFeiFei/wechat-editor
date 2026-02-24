"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">Markdown</header>
      <div className="min-h-0 flex-1 overflow-auto">
        <CodeMirror
          value={value}
          extensions={[markdown()]}
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
