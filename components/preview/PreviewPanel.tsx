import { useEffect, useRef } from "react";

interface PreviewPanelProps {
  html: string;
  cardWidth: number;
  syncEnabled: boolean;
  scrollRatio: number;
  onScrollRatioChange: (ratio: number) => void;
}

export function PreviewPanel({ html, cardWidth, syncEnabled, scrollRatio, onScrollRatioChange }: PreviewPanelProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const syncingRef = useRef(false);

  useEffect(() => {
    const scroller = scrollRef.current;
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
    const scroller = scrollRef.current;
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
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700">WeChat Preview</header>
      <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto p-5" ref={scrollRef}>
        <article className="rounded-2xl bg-white p-4 shadow" style={{ width: `${cardWidth}px` }}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </div>
    </section>
  );
}
