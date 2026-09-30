"use client"

import { useEffect, useRef, useState } from "react"
import type { CatalogEntry } from "@/lib/catalog"
import { fadeRef } from "@/lib/imgFade"
import BoxBadge from "./BoxBadge"
import type { Stats } from "./Archive"

function useCountUp(target: number, delay = 0, duration = 1800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0
    const start = performance.now() + (reduce ? 0 : delay)
    const frame = (now: number) => {
      const t = reduce ? 1 : Math.min(1, Math.max(0, (now - start) / duration))
      const eased = 1 - Math.pow(1 - t, 4)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [target, delay, duration])
  return value
}

function Stat({ label, value, delay }: { label: string; value: number; delay: number }) {
  const n = useCountUp(value, delay)
  return (
    <div className="fade-up border-t border-ink pt-3" style={{ "--d": `${delay / 1000}s` } as React.CSSProperties}>
      <p className="mono-label text-mute">{label}</p>
      <p className="mt-2 text-[clamp(32px,4.4vw,64px)] leading-none font-medium tracking-[-0.045em] tabular-nums">
        {n.toLocaleString()}
      </p>
    </div>
  )
}

export default function Hero({
  stats,
  picks,
  onOpen,
}: {
  stats: Stats
  picks: CatalogEntry[]
  onOpen: (id: string, from?: HTMLElement | null) => void
}) {
  const since = stats.since.replaceAll("-", ".")

  return (
    <section className="relative pt-24 sm:pt-28">
      <div className="gutter">
        <div className="flex items-center justify-between mono-label text-mute fade-up" style={{ "--d": "0.1s" } as React.CSSProperties}>
          <span>(01) Private Collection — Taipei</span>
          <span className="hidden sm:inline">Catalogued since {since}</span>
        </div>

        <h1 className="mt-6 sm:mt-10 text-[clamp(38px,11.2vw,212px)] leading-[0.86] tracking-[-0.055em] font-medium">
          <span className="line-mask" style={{ "--d": "0.05s" } as React.CSSProperties}>
            <span>A private archive</span>
          </span>
          <span className="line-mask" style={{ "--d": "0.14s" } as React.CSSProperties}>
            <span>
              of <em className="font-serif font-normal italic tracking-[-0.03em] text-blue">small giants.</em>
            </span>
          </span>
        </h1>

        <div className="mt-10 sm:mt-14 grid gap-10 lg:grid-cols-12">
          <p
            className="lg:col-span-4 text-[15px] leading-relaxed text-ink-2 max-w-md fade-up"
            style={{ "--d": "0.6s" } as React.CSSProperties}
          >
            小小的巨人們。鋼彈模型、超合金、黏土人、景品與可動人偶 ——
            每一件都附上編號、出處、官方資料與開箱評測，像博物館一樣逐件建檔。
          </p>
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-8">
            <Stat label="Objects" value={stats.objects} delay={700} />
            <Stat label="Series" value={stats.series} delay={820} />
            <Stat label="Makers" value={stats.makers} delay={940} />
            <Stat label="Boxes" value={stats.boxes} delay={1060} />
          </div>
        </div>
      </div>

      <Shelf picks={picks} onOpen={onOpen} />
    </section>
  )
}

function Shelf({ picks, onOpen }: { picks: CatalogEntry[]; onOpen: (id: string, from?: HTMLElement | null) => void }) {
  const loop = [...picks, ...picks]
  const hostRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={hostRef}
      className="marquee-host relative mt-20 sm:mt-28 overflow-hidden border-y border-line fade-up"
      style={{ "--d": "1s" } as React.CSSProperties}
    >
      <div className="marquee" style={{ "--dur": "140s" } as React.CSSProperties}>
        {loop.map((p, i) => (
          <button
            key={`${p.id}-${i}`}
            onClick={(e) => onOpen(p.id, e.currentTarget.querySelector("img"))}
            className="group relative shrink-0 w-[clamp(180px,21vw,340px)] aspect-[4/5] bg-tile border-r border-line text-left"
            data-cursor="View"
            aria-hidden={i >= picks.length}
            tabIndex={i >= picks.length ? -1 : 0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={fadeRef}
              data-fade
              src={p.thumb}
              data-full={p.imageUrl}
              alt={p.name}
              loading={i < 8 ? "eager" : "lazy"}
              decoding="async"
              className="blend absolute inset-0 m-auto w-[82%] h-[76%] object-contain group-hover:scale-[1.06]"
            />
            <span className="absolute left-3 top-3 max-w-[60%] truncate text-[12px] text-ink-2 bg-paper/85 rounded-full px-2.5 py-1 leading-none">{p.work}</span>
            {p.box && <BoxBadge box={p.box} className="absolute right-3 top-3" />}
            <span className="absolute left-3 right-3 bottom-3 text-[12px] leading-snug line-clamp-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              {p.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
