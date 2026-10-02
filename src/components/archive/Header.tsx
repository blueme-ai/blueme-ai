"use client"

import { useEffect, useState } from "react"

export default function Header({ total, onSearch }: { total: number; onSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Taipei",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500 border-b ${scrolled ? "bg-paper/85 backdrop-blur-md border-line" : "border-transparent"}`}
    >
      <div className="gutter h-14 grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_1fr] items-center gap-6">
        <a href="#" className="flex items-baseline gap-1 w-fit" aria-label="blueme home" data-cursor="Top">
          <span className="text-[19px] font-semibold tracking-[-0.04em]">blueme</span>
          <span className="mono-label text-blue">®</span>
        </a>

        <nav className="hidden sm:flex items-center gap-7 mono-label">
          <a href="#archive" className="draw">Archive</a>
          <span className="text-mute tabular-nums">{total.toLocaleString()} obj.</span>
          <span className="text-mute tabular-nums" suppressHydrationWarning>
            TPE {time || "--:--:--"}
          </span>
        </nav>

        <div className="flex justify-end">
          <button
            onClick={onSearch}
            className="group flex items-center gap-3 mono-label rounded-full border border-line pl-4 pr-1.5 pointer-coarse:pr-4 py-1.5 min-h-10 hover:border-ink transition-colors"
          >
            Search
            <kbd className="pointer-coarse:hidden font-mono text-[10px] rounded-full bg-ink text-paper px-2 py-0.5 group-hover:bg-blue transition-colors">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  )
}
