"use client"

import { useState } from "react"
import { CollectibleItem } from "@/lib/data"
import { isBoxTag } from "@/lib/tags"
import { Package } from "lucide-react"
import ItemModal from "./ItemModal"

export default function CollectionCard({ item, onTagClick }: { item: CollectibleItem; onTagClick?: (tag: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        id={item.id}
        className="group relative bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-indigo-500 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-900/20"
        onClick={() => setOpen(true)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                "https://placehold.co/300x400/18181b/52525b?text=No+Image"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-xs text-indigo-400 font-medium truncate">{item.manufacturer} · {item.scale}</p>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-zinc-500 mb-1 truncate">{item.series}</p>
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">{item.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-indigo-400 font-bold text-sm">{item.price}</span>
            <span className="text-zinc-500 text-xs">{item.releaseDate.replace(/（.*）/, "")}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {(() => {
              const boxTag = item.tags.find(isBoxTag)
              const rest = item.tags.filter((t) => t !== boxTag).slice(0, boxTag ? 2 : 3)
              return (
                <>
                  {boxTag && (
                    <span className="inline-flex items-center gap-1 text-xs bg-amber-900/30 text-amber-300 rounded-full px-2 py-0.5">
                      <Package size={10} />
                      {boxTag}
                    </span>
                  )}
                  {rest.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              )
            })()}
          </div>
        </div>
      </div>

      {open && (
        <ItemModal
          item={item}
          onClose={() => setOpen(false)}
          onTagClick={(tag) => {
            setOpen(false)
            onTagClick?.(tag)
          }}
        />
      )}
    </>
  )
}
