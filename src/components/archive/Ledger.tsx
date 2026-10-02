"use client"

import type { Insights } from "@/lib/insights"

type Props = {
  insights: Insights
  part: string
  activeBox: string | null
  onBox: (box: string) => void
  onSeries: (series: string) => void
  onMaker: (maker: string) => void
}

// How the archive grew and where it physically lives. Every figure is a way into the index.
export default function Ledger({ insights, part, activeBox, onBox, onSeries, onMaker }: Props) {
  const peak = Math.max(1, ...insights.monthly.map((m) => m.count))

  return (
    <section id="ledger" className="scroll-mt-14 pt-28 sm:pt-40">
      <div className="gutter">
        <p className="mono-label text-mute">({part}) The Ledger</p>
        <h2 className="mt-4 text-[clamp(40px,6.4vw,112px)] leading-[0.9] tracking-[-0.05em] font-medium">
          Where it all <em className="font-serif font-normal italic tracking-[-0.02em]">lives.</em>
        </h2>

        <div className="mt-12 sm:mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="mono-label text-mute">Acquired, last 12 months</h3>
            <div className="mt-6 flex items-end gap-1.5 h-40 border-b border-ink" role="img" aria-label="每月入藏件數">
              {insights.monthly.map((m) => (
                <div key={m.label} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5" title={`${m.label}：${m.count} 件`}>
                  <span className="font-mono text-[10px] text-mute tabular-nums">{m.count || ""}</span>
                  <div className="w-full bg-ink" style={{ height: `${m.count ? Math.max(3, (m.count / peak) * 120) : 0}px` }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-1.5">
              {insights.monthly.map((m) => (
                <span key={m.label} className="flex-1 text-center font-mono text-[10px] text-mute tabular-nums">
                  {m.label.slice(5)}
                </span>
              ))}
            </div>
            {insights.yenCount > 0 && (
              <p className="mt-6 text-[14px] text-ink-2">
                <span className="mono-label text-mute mr-3">List value</span>
                <span className="tabular-nums font-medium">¥{insights.yenTotal.toLocaleString()}</span>
                <span className="text-mute"> · {insights.yenCount.toLocaleString()} 件日圓定價合計</span>
              </p>
            )}
          </div>

          <Rank className="lg:col-span-4" title="Most collected series" items={insights.topSeries} onPick={onSeries} />
          <Rank className="lg:col-span-3" title="Makers" items={insights.topMakers} onPick={onMaker} />
        </div>

        <div className="mt-16">
          <h3 className="mono-label text-mute">By the box — {insights.boxes.length} boxes</h3>
          <ul className="mt-6 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 border-l border-t border-line">
            {insights.boxes.map((b) => (
              <li key={b.label} className="border-r border-b border-line">
                <button
                  onClick={() => onBox(b.label)}
                  aria-pressed={activeBox === b.label}
                  className={`group w-full text-left p-2.5 sm:p-4 transition-colors ${
                    activeBox === b.label ? "bg-amber text-paper" : "hover:bg-amber hover:text-paper"
                  }`}
                  data-cursor="Open"
                >
                  <span className="block font-mono text-[11px] tracking-wide truncate">{b.label}</span>
                  <span className="mt-2 sm:mt-3 block text-[22px] sm:text-[30px] leading-none font-medium tracking-[-0.04em] tabular-nums">
                    {b.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Rank({
  title,
  items,
  onPick,
  className = "",
}: {
  title: string
  items: Insights["topSeries"]
  onPick: (label: string) => void
  className?: string
}) {
  const max = Math.max(1, ...items.map((i) => i.count))
  return (
    <div className={className}>
      <h3 className="mono-label text-mute">{title}</h3>
      <ol className="mt-6 border-t border-ink">
        {items.map((i, n) => (
          <li key={i.label}>
            <button
              onClick={() => onPick(i.label)}
              className="group relative w-full grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-2 py-2.5 border-b border-line text-left hover:text-blue transition-colors"
            >
              <span className="font-mono text-[11px] text-mute tabular-nums">{String(n + 1).padStart(2, "0")}</span>
              <span className="text-[14px] truncate">{i.label}</span>
              <span className="font-mono text-[12px] tabular-nums">{i.count}</span>
              <span className="absolute left-8 bottom-0 h-px bg-ink group-hover:bg-blue" style={{ width: `calc((100% - 2rem) * ${i.count / max})` }} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
