"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Search, X, ChevronDown, Package, ArrowUpDown, Star } from "lucide-react"
import { CollectibleItem } from "@/lib/data"
import { isBoxTag } from "@/lib/tags"
import { computeInsights } from "@/lib/insights"
import CollectionCard from "./CollectionCard"
import CollectionInsights from "./CollectionInsights"
import ItemModal from "./ItemModal"

const PAGE = 40

export default function CollectionGrid({ collection }: { collection: CollectibleItem[] }) {
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [tagsOpen, setTagsOpen] = useState(false)
  const [sortNewestFirst, setSortNewestFirst] = useState(true)
  const [limit, setLimit] = useState(PAGE)
  const [openId, setOpenId] = useState<string | null>(null)
  const pushedRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of collection) {
      for (const tag of item.tags) {
        counts[tag] = (counts[tag] ?? 0) + 1
      }
    }
    return counts
  }, [collection])

  const sortedTags = useMemo(
    () =>
      Object.entries(tagCounts)
        .filter(([tag, count]) => count > 1 && !isBoxTag(tag))
        .sort((a, b) => b[1] - a[1])
        .map(([tag]) => tag),
    [tagCounts]
  )

  const insights = useMemo(() => computeInsights(collection), [collection])
  const favorites = useMemo(() => collection.filter((i) => i.favorite), [collection])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return collection
      .filter((item) => {
        const matchesTag = !selectedTag || item.tags.includes(selectedTag)
        const matchesSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          (item.nameJa ?? "").toLowerCase().includes(q) ||
          item.series.toLowerCase().includes(q) ||
          item.manufacturer.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
        return matchesTag && matchesSearch
      })
      .sort((a, b) =>
        sortNewestFirst ? b.addedAt.localeCompare(a.addedAt) : a.addedAt.localeCompare(b.addedAt)
      )
  }, [collection, search, selectedTag, sortNewestFirst])

  // Back to the first page whenever the result set changes.
  const filterKey = `${search}|${selectedTag}|${sortNewestFirst}`
  const [pagedKey, setPagedKey] = useState(filterKey)
  if (pagedKey !== filterKey) {
    setPagedKey(filterKey)
    setLimit(PAGE)
  }
  const visible = filtered.slice(0, limit)
  const hasMore = limit < filtered.length

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setLimit((l) => l + PAGE),
      { rootMargin: "800px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, visible.length])

  // Deep links: #item-id opens that item; browser back closes it.
  useEffect(() => {
    const sync = () => {
      const id = decodeURIComponent(location.hash.slice(1))
      setOpenId(id && collection.some((i) => i.id === id) ? id : null)
      if (!id) pushedRef.current = false
    }
    sync()
    window.addEventListener("popstate", sync)
    return () => window.removeEventListener("popstate", sync)
  }, [collection])

  const open = useCallback((id: string) => {
    const url = `#${encodeURIComponent(id)}`
    if (location.hash) history.replaceState(null, "", url)
    else {
      history.pushState(null, "", url)
      pushedRef.current = true
    }
    setOpenId(id)
  }, [])

  const close = useCallback(() => {
    setOpenId(null)
    if (pushedRef.current) {
      pushedRef.current = false
      history.back()
    } else {
      history.replaceState(null, "", location.pathname + location.search)
    }
  }, [])

  const filterBy = useCallback(
    (tag: string | null) => {
      setSelectedTag(tag)
      setSearch("")
      if (openId) close()
    },
    [openId, close]
  )

  const searchFor = (q: string) => {
    setSearch(q)
    setSelectedTag(null)
  }

  // Prev/next walk the current result list, not the whole collection.
  const index = openId ? filtered.findIndex((i) => i.id === openId) : -1
  const openItem = openId ? collection.find((i) => i.id === openId) : undefined
  const step = (d: number) => {
    const next = filtered[index + d]
    if (next) open(next.id)
  }

  const filtering = Boolean(selectedTag || search.trim())

  return (
    <>
      {favorites.length > 0 && !filtering && (
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-300 mb-3">
            <Star size={15} fill="currentColor" /> 本命精選
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {favorites.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => open(item.id)}
                className="snap-start shrink-0 w-56 sm:w-64 text-left rounded-2xl overflow-hidden border border-amber-500/40 bg-zinc-900 hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.name} className="w-full aspect-square object-cover" />
                <span className="block p-3">
                  <span className="block text-sm font-semibold text-white line-clamp-2">{item.name}</span>
                  {item.note && <span className="block mt-1 text-xs text-amber-200/80 italic line-clamp-3">「{item.note}」</span>}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <CollectionInsights insights={insights} activeBox={selectedTag && isBoxTag(selectedTag) ? selectedTag : null} onBox={filterBy} onSearch={searchFor} />

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋名稱、系列、廠商、標籤…"
          aria-label="搜尋收藏品"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-full pl-9 pr-9 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="清除搜尋"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tag filter toggle + sort order toggle */}
      <div className="mt-3 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setTagsOpen(!tagsOpen)}
            aria-expanded={tagsOpen}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors py-2"
          >
            <ChevronDown size={14} className={`transition-transform ${tagsOpen ? "rotate-180" : ""}`} />
            標籤篩選
            {selectedTag && (
              <span className="ml-1 bg-indigo-600 text-white rounded-full px-2 py-0.5">{selectedTag}</span>
            )}
          </button>

          <button
            onClick={() => setSortNewestFirst(!sortNewestFirst)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors flex-shrink-0 py-2"
          >
            <ArrowUpDown size={13} />
            {sortNewestFirst ? "最新加入優先" : "最早加入優先"}
          </button>
        </div>

        {tagsOpen && (
          <div className="flex flex-wrap gap-2 mt-3">
            {sortedTags.map((tag) => {
              const active = selectedTag === tag
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(active ? null : tag)}
                  className={`inline-flex items-center gap-1 flex-shrink-0 text-xs rounded-full px-3 py-1 transition-colors ${
                    active ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {tag}
                  {active && <X size={10} className="inline ml-1 -mt-0.5" />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Results count when filtering */}
      {filtering && (
        <div className="flex items-center gap-2 mb-4 text-sm text-zinc-400">
          {selectedTag && isBoxTag(selectedTag) && <Package size={14} className="text-amber-400" />}
          <span>顯示 {filtered.length} / {collection.length} 件</span>
          <button
            onClick={() => {
              setSelectedTag(null)
              setSearch("")
            }}
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          >
            清除篩選
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visible.map((item) => (
          <CollectionCard key={item.id} item={item} onOpen={open} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-zinc-500">沒有符合的收藏品</p>
      )}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-10">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE)}
            className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-4 py-2 hover:text-white hover:border-zinc-500"
          >
            載入更多（{visible.length} / {filtered.length}）
          </button>
        </div>
      )}

      {openItem && (
        <ItemModal
          item={openItem}
          onClose={close}
          onTagClick={filterBy}
          position={index >= 0 ? { index, total: filtered.length } : undefined}
          onPrev={index > 0 ? () => step(-1) : undefined}
          onNext={index >= 0 && index < filtered.length - 1 ? () => step(1) : undefined}
        />
      )}
    </>
  )
}
