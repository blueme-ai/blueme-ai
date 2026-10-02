"use client"

import { useState } from "react"
import { ChevronDown, Package, BarChart3 } from "lucide-react"
import type { Insights } from "@/lib/insights"

type Props = {
  insights: Insights
  activeBox: string | null
  onBox: (box: string | null) => void
  onSearch: (q: string) => void
}

export default function CollectionInsights({ insights, activeBox, onBox, onSearch }: Props) {
  const [open, setOpen] = useState(false)
  const peak = Math.max(1, ...insights.monthly.map((m) => m.count))

  return (
    <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white"
      >
        <span className="flex items-center gap-2">
          <BarChart3 size={15} className="text-indigo-400" />
          收藏概覽
          <span className="text-xs text-zinc-500">
            {insights.boxes.length} 箱 · {insights.topMakers.length > 0 && `最多：${insights.topMakers[0].label}`}
          </span>
        </span>
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Boxes are always visible: they are how the collection is physically stored. */}
      <div className="px-4 pb-3">
        <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5">
          <Package size={12} className="text-amber-400" /> 依收納箱瀏覽
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none [mask-image:linear-gradient(to_right,black_92%,transparent)]">
          {insights.boxes.map((b) => {
            const active = activeBox === b.label
            return (
              <button
                key={b.label}
                type="button"
                onClick={() => onBox(active ? null : b.label)}
                className={`shrink-0 text-xs rounded-lg px-2.5 py-1.5 border transition-colors ${
                  active
                    ? "bg-amber-500 border-amber-400 text-zinc-950"
                    : "bg-amber-900/20 border-amber-700/50 text-amber-200 hover:bg-amber-800/40"
                }`}
              >
                {b.label}
                <span className={`ml-1.5 ${active ? "text-zinc-800" : "text-amber-500/70"}`}>{b.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {open && (
        <div className="grid gap-5 md:grid-cols-3 px-4 pb-5 pt-2 border-t border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500 mb-3">近 12 個月入藏</p>
            <div className="flex items-end gap-1 h-24" role="img" aria-label="每月入藏件數">
              {insights.monthly.map((m) => (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end" title={`${m.label}：${m.count} 件`}>
                  <span className="text-[10px] text-zinc-500">{m.count || ""}</span>
                  <div
                    className="w-full rounded-sm bg-indigo-500/80"
                    style={{ height: `${Math.max(m.count ? 4 : 1, (m.count / peak) * 72)}px` }}
                  />
                  <span className="text-[10px] text-zinc-600">{Number(m.label.slice(5))}</span>
                </div>
              ))}
            </div>
            {insights.yenCount > 0 && (
              <p className="mt-3 text-xs text-zinc-500">
                日圓定價合計 <span className="text-zinc-200 font-semibold">¥{insights.yenTotal.toLocaleString()}</span>
                （{insights.yenCount} 件）
              </p>
            )}
          </div>
          <RankList title="最多的系列" items={insights.topSeries} onPick={onSearch} />
          <RankList title="最多的廠商" items={insights.topMakers} onPick={onSearch} />
        </div>
      )}
    </section>
  )
}

function RankList({ title, items, onPick }: { title: string; items: Insights["topSeries"]; onPick: (q: string) => void }) {
  const max = Math.max(1, ...items.map((i) => i.count))
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-3">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((i) => (
          <li key={i.label}>
            <button
              type="button"
              onClick={() => onPick(i.label)}
              className="relative w-full text-left text-xs rounded-md px-2 py-1 overflow-hidden hover:text-white text-zinc-300"
            >
              <span className="absolute inset-y-0 left-0 bg-indigo-500/15" style={{ width: `${(i.count / max) * 100}%` }} />
              <span className="relative flex justify-between gap-2">
                <span className="truncate">{i.label}</span>
                <span className="text-zinc-500 shrink-0">{i.count}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
