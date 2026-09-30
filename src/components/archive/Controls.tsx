"use client"

import { useState, type RefObject } from "react"
import { isBoxTag } from "@/lib/tags"

export type SortKey = "newest" | "oldest" | "release" | "name"
export type ViewMode = "grid" | "index"

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "最新入藏" },
  { key: "oldest", label: "最早入藏" },
  { key: "release", label: "發售年份" },
  { key: "name", label: "名稱" },
]

type Props = {
  searchRef: RefObject<HTMLInputElement | null>
  query: string
  setQuery: (q: string) => void
  makers: [string, number][]
  maker: string | null
  setMaker: (m: string | null) => void
  tags: [string, number][]
  tag: string | null
  setTag: (t: string | null) => void
  sort: SortKey
  setSort: (s: SortKey) => void
  view: ViewMode
  setView: (v: ViewMode) => void
  shown: number
  total: number
}

export default function Controls({ searchRef, ...p }: Props) {
  const [tagsOpen, setTagsOpen] = useState(false)
  const topMakers = p.makers.slice(0, 9)
  const filtering = !!(p.query.trim() || p.maker || p.tag)

  return (
    <>
      <div className="gutter pt-28 sm:pt-40 pb-8 sm:pb-12 grid gap-6 sm:grid-cols-12 items-end">
        <div className="sm:col-span-7">
          <p className="mono-label text-mute">(02) The Index</p>
          <h2 className="mt-4 text-[clamp(44px,7.4vw,132px)] leading-[0.88] tracking-[-0.05em] font-medium">
            Every object,
            <br />
            <em className="font-serif font-normal italic tracking-[-0.02em]">numbered.</em>
          </h2>
        </div>
        <p className="sm:col-span-5 sm:justify-self-end text-right">
          <span className="block text-[clamp(56px,9vw,160px)] leading-[0.8] tracking-[-0.06em] font-medium tabular-nums">
            {p.shown.toLocaleString()}
          </span>
          <span className="mono-label text-mute">
            {filtering ? `of ${p.total.toLocaleString()} records` : "records in archive"}
          </span>
        </p>
      </div>

      <div className="sticky top-14 z-30 bg-paper/90 backdrop-blur-md border-y border-line">
        <div className="gutter flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6 py-3">
          <label className="relative flex items-center gap-3 lg:w-[28%] min-w-0 border-b border-transparent focus-within:border-ink transition-colors">
            <span className="mono-label text-mute shrink-0">Find</span>
            <input
              ref={searchRef}
              value={p.query}
              onChange={(e) => p.setQuery(e.target.value)}
              placeholder="名稱、系列、廠商、編號…"
              className="w-full bg-transparent text-[15px] placeholder:text-mute/70 !outline-none py-1"
              aria-label="Search the archive"
            />
            {p.query && (
              <button onClick={() => p.setQuery("")} className="mono-label text-mute hover:text-ink" aria-label="Clear search">
                Clear
              </button>
            )}
          </label>

          <div className="flex-1 min-w-0 flex gap-1.5 overflow-x-auto no-scrollbar fade-edge -mx-1 px-1 pr-12">
            <Chip active={!p.maker} onClick={() => p.setMaker(null)}>
              All
            </Chip>
            {topMakers.map(([m, n]) => (
              <Chip key={m} active={p.maker === m} onClick={() => p.setMaker(p.maker === m ? null : m)}>
                {m}
                <sup className="ml-1 text-[9px] opacity-60 tabular-nums">{n}</sup>
              </Chip>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 shrink-0">
            <button
              onClick={() => setTagsOpen((o) => !o)}
              className={`mono-label transition-colors ${tagsOpen || p.tag ? "text-blue" : "text-mute hover:text-ink"}`}
              aria-expanded={tagsOpen}
            >
              Tags {p.tag ? `· ${p.tag}` : tagsOpen ? "−" : "+"}
            </button>
            <label className="mono-label text-mute flex items-center gap-2">
              Sort
              <select
                value={p.sort}
                onChange={(e) => p.setSort(e.target.value as SortKey)}
                className="bg-transparent text-ink outline-none cursor-pointer normal-case tracking-normal text-[13px] font-sans"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex rounded-full border border-line p-0.5" role="group" aria-label="View mode">
              {(["grid", "index"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => p.setView(v)}
                  aria-pressed={p.view === v}
                  className={`mono-label rounded-full px-3 py-1 transition-colors ${
                    p.view === v ? "bg-ink text-paper" : "text-mute hover:text-ink"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {tagsOpen && (
          <div className="gutter pb-4 max-h-[42vh] overflow-y-auto border-t border-line pt-4">
            <div className="flex flex-wrap gap-1.5">
              {p.tag && (
                <Chip active onClick={() => p.setTag(null)}>
                  ✕ Clear tag
                </Chip>
              )}
              {p.tags.map(([t, n]) => (
                <Chip key={t} active={p.tag === t} box={isBoxTag(t)} onClick={() => p.setTag(p.tag === t ? null : t)}>
                  {t}
                  <sup className="ml-1 text-[9px] opacity-60 tabular-nums">{n}</sup>
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function Chip({
  active,
  box,
  onClick,
  children,
}: {
  active?: boolean
  box?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={!!active}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[12.5px] transition-colors ${
        active
          ? box
            ? "bg-amber border-amber text-paper"
            : "bg-ink border-ink text-paper"
          : box
            ? "border-amber/50 text-amber hover:bg-amber hover:text-paper"
            : "border-line hover:border-ink"
      }`}
    >
      {children}
    </button>
  )
}
