"use client"

import type { CatalogEntry } from "@/lib/catalog"
import { fadeRef } from "@/lib/imgFade"

type OpenFn = (id: string, from?: HTMLElement | null) => void

// The owner's own picks, each with the note they wrote for it.
export default function Favourites({ items, part, onOpen }: { items: CatalogEntry[]; part: string; onOpen: OpenFn }) {
  return (
    <section id="favourites" className="scroll-mt-14 pt-28 sm:pt-40">
      <div className="gutter grid gap-6 sm:grid-cols-12 items-end">
        <div className="sm:col-span-8">
          <p className="mono-label text-mute">({part}) Favourites</p>
          <h2 className="mt-4 text-[clamp(40px,6.4vw,112px)] leading-[0.9] tracking-[-0.05em] font-medium">
            The ones that <em className="font-serif font-normal italic tracking-[-0.02em] text-blue">matter.</em>
          </h2>
        </div>
        <p className="sm:col-span-4 sm:justify-self-end mono-label text-mute">{items.length} picks — 本命精選</p>
      </div>

      <ol className="mt-12 sm:mt-16 flex gap-px overflow-x-auto no-scrollbar snap-x snap-mandatory border-y border-line bg-line">
        {items.map((item, i) => (
          <li key={item.id} className="snap-start shrink-0 w-[78vw] sm:w-[44vw] lg:w-[30vw] bg-paper">
            <button
              onClick={(e) => onOpen(item.id, e.currentTarget.querySelector("img"))}
              className="group block w-full text-left"
              data-cursor="View"
            >
              <div className="relative aspect-[4/5] bg-tile overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={fadeRef}
                  data-fade
                  src={item.thumb}
                  data-full={item.imageUrl}
                  alt={item.name}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="blend absolute inset-0 m-auto w-[82%] h-[80%] object-contain group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3 mono-label text-mute tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-4 sm:p-6">
                <p className="mono-label text-mute truncate">{item.work}</p>
                <h3 className="mt-2 text-[17px] sm:text-[20px] leading-snug font-medium tracking-[-0.02em] line-clamp-2 group-hover:text-blue transition-colors">
                  {item.name}
                </h3>
                {item.note && (
                  <p className="mt-4 font-serif italic text-[18px] sm:text-[21px] leading-snug text-ink-2 line-clamp-4">
                    “{item.note}”
                  </p>
                )}
              </div>
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
