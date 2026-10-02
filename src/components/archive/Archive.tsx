"use client"

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"
import type { CatalogEntry } from "@/lib/catalog"
import { computeInsights } from "@/lib/insights"
import { isBoxTag } from "@/lib/tags"
import Header from "./Header"
import Hero from "./Hero"
import Controls, { type SortKey, type ViewMode } from "./Controls"
import Grid from "./Grid"
import IndexList from "./IndexList"
import Detail from "./Detail"
import Footer from "./Footer"
import Favourites from "./Favourites"
import Ledger from "./Ledger"
import Cursor from "./Cursor"

export type Stats = {
  objects: number
  makers: number
  series: number
  boxes: number
  since: string
  latest: string
}

const BATCH = 48

export default function Archive({ catalog, stats }: { catalog: CatalogEntry[]; stats: Stats }) {
  const [query, setQuery] = useState("")
  const [maker, setMaker] = useState<string | null>(null)
  const [tag, setTag] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>("newest")
  const [view, setView] = useState<ViewMode>("grid")
  const [limit, setLimit] = useState(BATCH)
  const [openId, setOpenId] = useState<string | null>(null)
  const archiveRef = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const pushedRef = useRef(false)

  const deferredQuery = useDeferredValue(query)

  const makers = useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of catalog) counts.set(c.maker, (counts.get(c.maker) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [catalog])

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of catalog) for (const t of c.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1])
  }, [catalog])

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    const list = catalog.filter((c) => {
      if (maker && c.maker !== maker) return false
      if (tag && !c.tags.includes(tag)) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.series.toLowerCase().includes(q) ||
        c.maker.toLowerCase().includes(q) ||
        String(c.no).padStart(4, "0").includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
    const sorted = [...list]
    if (sort === "newest") sorted.sort((a, b) => b.no - a.no)
    else if (sort === "oldest") sorted.sort((a, b) => a.no - b.no)
    else if (sort === "release") sorted.sort((a, b) => b.year.localeCompare(a.year) || b.no - a.no)
    else sorted.sort((a, b) => a.name.localeCompare(b.name, "ja"))
    return sorted
  }, [catalog, deferredQuery, maker, tag, sort])

  // Reset pagination whenever the result set changes shape.
  const filterKey = `${deferredQuery}|${maker}|${tag}|${sort}|${view}`
  const [pagedKey, setPagedKey] = useState(filterKey)
  if (pagedKey !== filterKey) {
    setPagedKey(filterKey)
    setLimit(BATCH)
  }

  const visible = filtered.slice(0, limit)
  const hasMore = limit < filtered.length
  const loadMore = useCallback(() => setLimit((l) => l + BATCH), [])

  const byId = useMemo(() => new Map(catalog.map((c) => [c.id, c])), [catalog])
  const openEntry = openId ? byId.get(openId) ?? null : null

  // The open record lives in the hash. Opening pushes one history entry so the
  // browser back button closes the sheet; stepping between records replaces it.
  const setHash = useCallback((id: string) => {
    if (location.hash) history.replaceState(null, "", `#${id}`)
    else {
      history.pushState(null, "", `#${id}`)
      pushedRef.current = true
    }
  }, [])

  const clearHash = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false
      history.back()
    } else if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search)
    }
  }, [])

  // Shared-element morph from the card image into the detail sheet.
  const open = useCallback((id: string, from?: HTMLElement | null) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setHash(id)
    if (!doc.startViewTransition || !from || reduce) {
      setOpenId(id)
      return
    }
    from.style.viewTransitionName = "hero-image"
    doc.startViewTransition(() => {
      from.style.viewTransitionName = ""
      flushSync(() => setOpenId(id))
    })
  }, [setHash])

  const close = useCallback(() => {
    clearHash()
    setOpenId(null)
  }, [clearHash])

  // Neighbour navigation follows the current filtered order.
  const step = useCallback(
    (dir: 1 | -1) => {
      if (!openId) return
      const idx = filtered.findIndex((c) => c.id === openId)
      const next = filtered[idx + dir]
      if (next) {
        history.replaceState(null, "", `#${next.id}`)
        setOpenId(next.id)
      }
    },
    [filtered, openId]
  )

  // Deep links: /#item-id opens that record; going back past it closes the sheet.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1))
      if (id && byId.has(id)) setOpenId(id)
      else if (!id) {
        pushedRef.current = false
        setOpenId(null)
      }
    }
    fromHash()
    window.addEventListener("popstate", fromHash)
    window.addEventListener("hashchange", fromHash)
    return () => {
      window.removeEventListener("popstate", fromHash)
      window.removeEventListener("hashchange", fromHash)
    }
  }, [byId])

  // ⌘K or "/" jumps to search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea")
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault()
        focusSearch()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function focusSearch() {
    archiveRef.current?.scrollIntoView({ behavior: "smooth" })
    setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 450)
  }

  function showInIndex(f: { tag?: string; maker?: string; query?: string }) {
    setTag(f.tag ?? null)
    setMaker(f.maker ?? null)
    setQuery(f.query ?? "")
    if (openId) {
      setOpenId(null)
      clearHash()
    }
    requestAnimationFrame(() => archiveRef.current?.scrollIntoView({ behavior: "smooth" }))
  }
  const pickTag = (t: string) => showInIndex({ tag: t })

  const insights = useMemo(
    () =>
      computeInsights(
        catalog.map((c) => ({ id: c.id, addedAt: c.addedAt, series: c.work, manufacturer: c.maker, price: c.price, tags: c.tags, favorite: c.favorite }))
      ),
    [catalog]
  )
  const favourites = useMemo(() => catalog.filter((c) => c.favorite).reverse(), [catalog])

  const heroPicks = useMemo(() => {
    // Favourites lead the hero shelf, topped up with an even sample across the archive.
    const n = 28
    const stepSize = Math.max(1, Math.floor(catalog.length / n))
    const sample = catalog.filter((c, i) => i % stepSize === 0 && !c.favorite)
    return [...favourites, ...sample].slice(0, n)
  }, [catalog, favourites])

  const part = (n: number) => String(n + (favourites.length ? 1 : 0)).padStart(2, "0")

  return (
    <>
      <Header total={stats.objects} onSearch={focusSearch} />
      <main>
        <Hero stats={stats} picks={heroPicks} onOpen={open} />
        {favourites.length > 0 && <Favourites items={favourites} part="02" onOpen={open} />}
        <Ledger
          insights={insights}
          part={part(2)}
          activeBox={tag && isBoxTag(tag) ? tag : null}
          onBox={(b) => showInIndex({ tag: b })}
          onSeries={(s) => showInIndex({ query: s })}
          onMaker={(m) => showInIndex({ maker: m })}
        />
        <section ref={archiveRef} id="archive" className="scroll-mt-14">
          <Controls
            searchRef={searchRef}
            query={query}
            setQuery={setQuery}
            makers={makers}
            maker={maker}
            setMaker={setMaker}
            tags={tags}
            tag={tag}
            setTag={setTag}
            sort={sort}
            setSort={setSort}
            view={view}
            setView={setView}
            shown={filtered.length}
            total={catalog.length}
            part={part(3)}
          />
          {filtered.length === 0 ? (
            <Empty
              onReset={() => {
                setQuery("")
                setMaker(null)
                setTag(null)
              }}
            />
          ) : view === "grid" ? (
            <Grid items={visible} onOpen={open} />
          ) : (
            <IndexList items={visible} onOpen={open} />
          )}
          {hasMore && <LoadMore onLoad={loadMore} remaining={filtered.length - limit} auto={limit < BATCH * 4} />}
        </section>
      </main>
      <Footer stats={stats} />
      {openEntry && (
        <Detail
          entry={openEntry}
          position={filtered.findIndex((c) => c.id === openEntry.id)}
          count={filtered.length}
          onClose={close}
          onStep={step}
          onTag={pickTag}
        />
      )}
      <Cursor />
    </>
  )
}

// Auto-loads the first few pages, then hands control back so the footer stays reachable.
function LoadMore({ onLoad, remaining, auto }: { onLoad: () => void; remaining: number; auto: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !auto) return
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && onLoad(), {
      rootMargin: "1200px 0px",
    })
    io.observe(el)
    return () => io.disconnect()
  }, [onLoad, auto])
  return (
    <div ref={ref} className="gutter pt-16 flex justify-center">
      <button
        onClick={onLoad}
        data-cursor="More"
        className="group flex items-center gap-4 rounded-full border border-ink pl-6 pr-2 py-2 text-[14px] hover:bg-ink hover:text-paper transition-colors"
      >
        Show more
        <span className="mono-label text-mute group-hover:text-paper/60 tabular-nums">{remaining.toLocaleString()} left</span>
        <span className="grid place-items-center size-8 rounded-full bg-ink text-paper group-hover:bg-blue transition-colors">↓</span>
      </button>
    </div>
  )
}

function Empty({ onReset }: { onReset: () => void }) {
  return (
    <div className="gutter py-40 text-center">
      <p className="font-serif text-6xl sm:text-8xl italic leading-none">Nothing here.</p>
      <p className="mt-6 text-mute">找不到符合條件的收藏。</p>
      <button onClick={onReset} className="mt-8 mono-label border-b border-ink pb-1 hover:text-blue hover:border-blue transition-colors">
        Clear all filters
      </button>
    </div>
  )
}
