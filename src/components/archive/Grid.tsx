"use client"

import { memo } from "react"
import { formatNo, type CatalogEntry } from "@/lib/catalog"
import { fadeRef } from "@/lib/imgFade"
import BoxBadge from "./BoxBadge"

type OpenFn = (id: string, from?: HTMLElement | null) => void

export default function Grid({ items, onOpen }: { items: CatalogEntry[]; onOpen: OpenFn }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 border-l border-line">
      {items.map((item, i) => (
        <Card key={item.id} item={item} index={i} onOpen={onOpen} />
      ))}
    </ul>
  )
}

const Card = memo(function Card({ item, index, onOpen }: { item: CatalogEntry; index: number; onOpen: OpenFn }) {
  return (
    <li className="cv-auto border-r border-b border-line card-in" style={{ "--i": index % 48 } as React.CSSProperties}>
      <button
        id={item.id}
        onClick={(e) => onOpen(item.id, e.currentTarget.querySelector("img"))}
        className="group block w-full text-left"
        data-cursor="View"
      >
        <div className="relative aspect-square bg-tile overflow-hidden">
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/[0.035] transition-colors duration-500" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={fadeRef}
            data-fade
            src={item.thumb}
            data-full={item.imageUrl}
            alt={item.name}
            loading={index < 8 ? "eager" : "lazy"}
            decoding="async"
            className="blend absolute inset-0 m-auto w-[80%] h-[80%] object-contain group-hover:scale-[1.05]"
          />
          <span className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 mono-label text-mute">No.{formatNo(item.no)}</span>
          {item.box && <BoxBadge box={item.box} className="absolute left-2 bottom-2 sm:left-3 sm:bottom-3 shadow-sm" />}
          <span className="absolute right-3 bottom-3 grid place-items-center size-8 rounded-full bg-ink text-paper text-sm scale-0 group-hover:scale-100 transition-transform duration-500 ease-[var(--ease-out)]">
            ↗
          </span>
        </div>
        <div className="p-3 sm:p-4 min-h-[112px] flex flex-col">
          <h3 className="text-[13.5px] sm:text-[14.5px] leading-snug font-medium line-clamp-2 tracking-[-0.01em] group-hover:text-blue transition-colors">
            {item.name}
          </h3>
          <p className="mt-1 text-[12px] text-mute line-clamp-1">{item.series}</p>
          <div className="mt-auto pt-3 flex items-center justify-between gap-2 font-mono text-[11px] text-mute">
            <span className="truncate uppercase tracking-wide">
              {item.maker} · {item.year}
            </span>
            <span className="shrink-0 text-ink tabular-nums">{shortPrice(item.price)}</span>
          </div>
        </div>
      </button>
    </li>
  )
})

export function shortPrice(price: string) {
  return price.replace(/[（(].*?[）)]/g, "").trim() || "—"
}
