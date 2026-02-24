interface PreviewPanelProps {
  html: string;
}

export function PreviewPanel({ html }: PreviewPanelProps) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700">WeChat Preview</header>
      <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto p-5">
        <article className="w-[375px] rounded-2xl bg-white p-4 shadow">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </div>
    </section>
  );
}
