"use client"

import { useState, useMemo } from "react"
import { Search, X, ChevronDown, Package } from "lucide-react"
import { CollectibleItem } from "@/lib/data"
import { isBoxTag } from "@/lib/tags"
import CollectionCard from "./CollectionCard"
export default function CollectionGrid({ collection }: { collection: CollectibleItem[] }) {
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [tagsOpen, setTagsOpen] = useState(false)

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
    () => Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag]) => tag),
    [tagCounts]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return collection.filter((item) => {
      const matchesTag = !selectedTag || item.tags.includes(selectedTag)
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.series.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      return matchesTag && matchesSearch
    })
  }, [collection, search, selectedTag])

  return (
    <>
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋收藏品..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Tag filter toggle */}
      <div className="mt-3 mb-6">
        <button
          onClick={() => setTagsOpen(!tagsOpen)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronDown size={14} className={`transition-transform ${tagsOpen ? "rotate-180" : ""}`} />
          標籤篩選
          {selectedTag && (
            <span className="ml-1 bg-indigo-600 text-white rounded-full px-2 py-0.5">{selectedTag}</span>
          )}
        </button>

        {tagsOpen && (
          <div className="flex flex-wrap gap-2 mt-3">
            {sortedTags.map((tag) => {
              const boxTag = isBoxTag(tag)
              const active = selectedTag === tag
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(active ? null : tag)}
                  className={`inline-flex items-center gap-1 flex-shrink-0 text-xs rounded-full px-3 py-1 transition-colors ${
                    active
                      ? boxTag
                        ? "bg-amber-600 text-white"
                        : "bg-indigo-600 text-white"
                      : boxTag
                      ? "bg-amber-900/30 border border-amber-600/60 text-amber-300 hover:bg-amber-600 hover:text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {boxTag && <Package size={11} />}
                  {tag}
                  {active && <X size={10} className="inline ml-1 -mt-0.5" />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Results count when filtering */}
      {(selectedTag || search.trim()) && (
        <div className="flex items-center gap-2 mb-4 text-sm text-zinc-400">
          <span>顯示 {filtered.length} / {collection.length} 件</span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              清除篩選
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <CollectionCard
            key={item.id}
            item={item}
            onTagClick={(tag) => {
              setSelectedTag(tag)
            }}
          />
        ))}

      </div>
    </>
  )
}
