"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { CollectibleItem } from "@/lib/data"
import CollectionCard from "./CollectionCard"
import { Plus } from "lucide-react"

export default function CollectionGrid({ collection }: { collection: CollectibleItem[] }) {
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

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

      {/* Tag chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mt-4 mb-6">
        {sortedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`flex-shrink-0 text-xs rounded-full px-3 py-1 transition-colors ${
              selectedTag === tag
                ? "bg-indigo-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {tag}
            {selectedTag === tag && <X size={10} className="inline ml-1 -mt-0.5" />}
          </button>
        ))}
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
          <CollectionCard key={item.id} item={item} />
        ))}

        {/* Add new placeholder */}
        <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-700 hover:bg-indigo-950/20 transition-all duration-200 group">
          <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-indigo-900/40 flex items-center justify-center transition-colors">
            <Plus size={20} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors font-medium">新增收藏品</p>
            <p className="text-xs text-zinc-600 mt-0.5">AI 自動辨識</p>
          </div>
        </div>
      </div>
    </>
  )
}
