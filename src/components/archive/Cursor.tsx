"use client"

import { useEffect, useRef, useState } from "react"

// Desktop-only cursor that grows into a label over interactive targets.
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduce) return
    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let raf = 0
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null
      setLabel(el?.dataset.cursor ?? null)
    }
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.22
      pos.y += (target.y - pos.y) * 0.22
      if (ref.current) ref.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    const onDown = () => setLabel(null)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[60] hidden [@media(pointer:fine)]:block motion-reduce:!hidden">
      <div
        className={`-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-blue text-paper mono-label transition-[width,height] duration-500 ease-[var(--ease-out)] ${
          label ? "size-[72px]" : "size-2.5"
        }`}
      >
        <span className={`transition-opacity duration-300 ${label ? "opacity-100" : "opacity-0"}`}>{label}</span>
      </div>
    </div>
  )
}
