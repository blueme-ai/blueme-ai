"use client"

import { useEffect, useRef, useState } from "react"
import type { CatalogEntry } from "@/lib/catalog"
import { shortPrice } from "./Grid"
import BoxBadge from "./BoxBadge"

type OpenFn = (id: string, from?: HTMLElement | null) => void

export default function IndexList({ items, onOpen }: { items: CatalogEntry[]; onOpen: OpenFn }) {
  const [hover, setHover] = useState<CatalogEntry | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Floating preview trails the pointer with a little inertia.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let raf = 0
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.14
      pos.y += (target.y - pos.y) * 0.14
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${pos.x + 28}px, ${pos.y - 120}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="gutter" onPointerLeave={() => setHover(null)}>
      <div className="hidden md:grid grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,2fr)_64px_110px] gap-6 py-3 mono-label text-mute border-b border-ink">
        <span>Object</span>
        <span>Series</span>
        <span>Maker</span>
        <span>Year</span>
        <span className="text-right">Price</span>
      </div>
      <ul>
        {items.map((item, i) => (
          <li key={item.id} className="card-in" style={{ "--i": i % 48 } as React.CSSProperties}>
            <button
              id={item.id}
              onClick={() => onOpen(item.id)}
              onPointerEnter={() => setHover(item)}
              onFocus={() => setHover(item)}
              className="group relative w-full text-left grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,2fr)_64px_110px] gap-x-4 md:gap-6 items-baseline py-4 border-b border-line"
              data-cursor="Open"
            >
              <span className="absolute inset-0 bg-ink origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[var(--ease-out)]" />
              <span className="relative min-w-0">
                <span className="flex items-center gap-2 min-w-0 transition-transform duration-500 group-hover:translate-x-2">
                  <span className="text-[15px] md:text-[17px] tracking-[-0.015em] font-medium truncate group-hover:text-paper transition-colors">
                    {item.name}
                  </span>
                  {item.box && <BoxBadge box={item.box} className="shrink-0 hidden md:inline-flex" />}
                </span>
                <span className="md:hidden flex items-center gap-2 min-w-0 mt-0.5">
                  {item.box && <BoxBadge box={item.box} className="shrink-0" />}
                  <span className="text-[12px] text-mute truncate group-hover:text-paper/60">{item.work}</span>
                </span>
              </span>
              <span className="relative hidden md:block text-[13px] text-mute truncate group-hover:text-paper/70 transition-colors">
                {item.series}
              </span>
              <span className="relative hidden md:block font-mono text-[11px] uppercase tracking-wide text-mute truncate group-hover:text-paper/70 transition-colors">
                {item.maker}
              </span>
              <span className="relative hidden md:block font-mono text-[12px] tabular-nums group-hover:text-paper transition-colors">
                {item.year}
              </span>
              <span className="relative font-mono text-[12px] text-right tabular-nums group-hover:text-paper transition-colors">
                <span className="md:hidden">{item.year}</span>
                <span className="hidden md:inline">{shortPrice(item.price)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden [@media(pointer:fine)]:block"
      >
        <div
          className={`w-[240px] aspect-[4/5] bg-tile shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] transition-[opacity,transform] duration-300 ease-[var(--ease-out)] ${
            hover ? "opacity-100 scale-100 rotate-[-2deg]" : "opacity-0 scale-90 rotate-0"
          }`}
        >
          {hover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={hover.id} src={hover.thumb} alt="" className="blend w-full h-full object-contain p-4" />
          )}
        </div>
      </div>
    </div>
  )
}
