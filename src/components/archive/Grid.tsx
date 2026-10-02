"use client"

import { memo } from "react"
import type { CatalogEntry } from "@/lib/catalog"
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
            className="blend absolute inset-0 m-auto w-[76%] h-[76%] sm:w-[80%] sm:h-[80%] object-contain group-hover:scale-[1.05]"
          />
          <span className="absolute left-2 top-2 sm:left-3 sm:top-3 max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-4rem)] truncate text-[11px] sm:text-[12px] text-ink-2 bg-paper/85 backdrop-blur-sm rounded-full px-2.5 py-1 leading-none">
            {item.work}
          </span>
          {item.favorite && (
            <span className="absolute left-2 bottom-2 sm:left-3 sm:bottom-3 rounded-full bg-blue text-paper font-mono text-[11px] leading-none px-2 py-1">★ Fav</span>
          )}
          {item.box && <BoxBadge box={item.box} className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 shadow-sm" />}
          <span className="absolute right-3 top-3 grid place-items-center size-8 rounded-full bg-ink text-paper text-sm scale-0 group-hover:scale-100 transition-transform duration-500 ease-[var(--ease-out)]">
            ↗
          </span>
        </div>
        <div className="p-3 sm:p-4 min-h-[92px] flex flex-col">
          <h3 className="text-[13.5px] sm:text-[14.5px] leading-snug font-medium line-clamp-2 tracking-[-0.01em] group-hover:text-blue transition-colors">
            {item.name}
          </h3>
          <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-mono text-[11px] text-mute">
            <span className="min-w-0 max-w-full flex uppercase tracking-wide">
              <span className="truncate">{item.maker}</span>
              <span className="shrink-0">&nbsp;· {item.year}</span>
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
