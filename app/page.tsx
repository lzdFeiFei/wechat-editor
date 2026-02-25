import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e7f0ff,_#f8fafc_40%,_#ffffff_80%)] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">WeChat Style Engine</p>
          <h1 className="mt-3 text-4xl font-semibold text-zinc-900">公众号排版模板化工作台</h1>
          <p className="mt-4 max-w-3xl text-zinc-600">
            面向内容编辑和运营，先通过模板沉淀样式资产，再将文章快速转换为可粘贴到公众号后台的富文本内容。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/templates"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              模板管理
            </Link>
            <Link
              href="/compose"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
            >
              文章排版
            </Link>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "模板资产化",
              detail: "支持模板创建、编辑、复制、删除、JSON 导入导出，并以更新时间管理版本。",
            },
            {
              title: "HTML 分析导入",
              detail: "可粘贴公众号 HTML，自动提取样式并生成模板，减少重复手调成本。",
            },
            {
              title: "按类型精修",
              detail: "在文章排版中针对 h1/h2/p/li/blockquote/img/hr 做局部精修，导出前可实时预览。",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">{item.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{item.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
