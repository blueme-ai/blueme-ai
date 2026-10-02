"use client"

import { memo } from "react"
import { CollectibleItem } from "@/lib/data"
import { isBoxTag } from "@/lib/tags"
import { Package, Star, Images } from "lucide-react"

function CollectionCard({ item, onOpen }: { item: CollectibleItem; onOpen: (id: string) => void }) {
  const boxTag = item.tags.find(isBoxTag)
  const rest = item.tags.filter((t) => t !== boxTag).slice(0, boxTag ? 2 : 3)

  return (
    <button
      type="button"
      id={item.id}
      onClick={() => onOpen(item.id)}
      className="group relative text-left bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-900/20"
    >
      <span className="block relative aspect-[3/4] overflow-hidden bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              "https://placehold.co/300x400/18181b/52525b?text=No+Image"
          }}
        />
        <span className="block absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        <span className="absolute top-2 left-2 flex gap-1">
          {item.favorite && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-400 text-zinc-950 rounded-full px-2 py-0.5">
              <Star size={10} fill="currentColor" /> 本命
            </span>
          )}
          {item.images && item.images.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-zinc-950/70 text-zinc-200 rounded-full px-2 py-0.5">
              <Images size={10} /> {item.images.length + 1}
            </span>
          )}
        </span>
        <span className="block absolute bottom-3 left-3 right-3">
          <span className="block text-xs text-indigo-400 font-medium truncate">{item.manufacturer} · {item.scale}</span>
        </span>
      </span>

      <span className="block p-4">
        <span className="block text-xs text-zinc-500 mb-1 truncate">{item.series}</span>
        <span className="block text-sm font-semibold text-white leading-snug line-clamp-2">{item.name}</span>
        {item.note && <span className="block mt-1.5 text-xs text-amber-200/80 italic line-clamp-2">「{item.note}」</span>}
        <span className="mt-2 flex items-center justify-between gap-2">
          <span className="text-indigo-400 font-bold text-sm truncate">{item.price}</span>
          <span className="text-zinc-500 text-xs shrink-0">{item.releaseDate.replace(/（.*）/, "")}</span>
        </span>
        <span className="mt-3 flex flex-wrap gap-1">
          {boxTag && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-900/30 text-amber-300 rounded-full px-2 py-0.5">
              <Package size={10} />
              {boxTag}
            </span>
          )}
          {rest.map((tag) => (
            <span key={tag} className="text-xs bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}

export default memo(CollectionCard)
