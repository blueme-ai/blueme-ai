"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CollectibleItem, ReviewLink } from "@/lib/data"
import type { CatalogEntry } from "@/lib/catalog"
import { isBoxTag } from "@/lib/tags"
import { distinctNameJa } from "@/lib/insights"
import { fadeRef } from "@/lib/imgFade"
import BoxBadge from "./BoxBadge"

type SecondhandData = {
  yahoo: { price: string; url: string } | null
  madarake: { price: string; url: string } | null
  surugaya: { price: string; url: string } | null
  searchUrls: { yahoo: string; madarake: string; surugaya: string }
}

const LANG: Record<ReviewLink["lang"], string> = { zh: "ZH", ja: "JA", en: "EN" }

const cache = new Map<string, CollectibleItem>()

export default function Detail({
  entry,
  position,
  count,
  onClose,
  onStep,
  onTag,
}: {
  entry: CatalogEntry
  position: number
  count: number
  onClose: () => void
  onStep: (dir: 1 | -1) => void
  onTag: (tag: string) => void
}) {
  const [loaded, setLoaded] = useState<CollectibleItem | null>(null)
  const item = loaded?.id === entry.id ? loaded : cache.get(entry.id) ?? null
  const [closing, setClosing] = useState(false)
  const [photo, setPhoto] = useState({ id: entry.id, index: 0 })
  const shown = photo.id === entry.id ? photo.index : 0
  const scrollRef = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const photos = [entry.imageUrl, ...(item?.images ?? [])]
  const nameJa = item ? distinctNameJa(item) : undefined

  // Horizontal swipe on the stage moves to the neighbouring record.
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current
    touch.current = null
    if (!start) return
    const dx = e.changedTouches[0].clientX - start.x
    const dy = e.changedTouches[0].clientY - start.y
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    onStep(dx < 0 ? 1 : -1)
  }

  useEffect(() => {
    let alive = true
    scrollRef.current?.scrollTo({ top: 0 })
    if (!cache.has(entry.id)) {
      fetch(`/api/item/${encodeURIComponent(entry.id)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: CollectibleItem | null) => {
          if (!data) return
          cache.set(entry.id, data)
          if (alive) setLoaded(data)
        })
        .catch(() => {})
    }
    return () => {
      alive = false
    }
  }, [entry.id])

  const close = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onClose()
    setClosing(true)
    setTimeout(onClose, 520)
  }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") onStep(1)
      if (e.key === "ArrowLeft") onStep(-1)
    }
    window.addEventListener("keydown", onKey)
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = prev
    }
  }, [close, onStep])

  const specs: [string, string | undefined][] = [
    ["Maker", item?.manufacturer ?? entry.maker],
    ["Scale", entry.scale],
    ["Price", entry.price],
    ["Release", item?.releaseDate ?? entry.year],
    ["Height", item?.height],
    ["Character", item?.character],
    ["Catalogued", entry.addedAt.replaceAll("-", ".")],
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={entry.name}
      className={`fixed inset-0 z-50 bg-paper ${closing ? "sheet-out" : "sheet-in"}`}
    >
      <button
        onClick={close}
        className="lg:hidden fixed right-[var(--gutter)] top-2.5 z-20 flex items-center gap-2 rounded-full bg-ink text-paper mono-label pl-4 pr-1.5 py-1.5"
        aria-label="Close"
      >
        Close
        <span className="grid place-items-center size-6 rounded-full bg-paper text-ink text-[11px]">✕</span>
      </button>
      <div ref={scrollRef} className="h-full overflow-y-auto lg:overflow-hidden lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Stage */}
        <div className="relative bg-tile h-[66svh] lg:h-full overflow-hidden touch-pan-y" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`full-${entry.id}-${shown}`}
            ref={fadeRef}
            data-fade
            src={photos[shown] ?? entry.imageUrl}
            alt={entry.name}
            className="detail-full blend absolute inset-x-0 top-14 bottom-20 m-auto w-[86%] h-[calc(100%-8.5rem)] lg:inset-0 lg:w-[82%] lg:h-[78%] object-contain"
          />
          {/* Thumbnail is already cached from the listing: it morphs in instantly, then yields to the full image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`thumb-${entry.id}`}
            src={entry.thumb}
            alt=""
            aria-hidden
            style={{ viewTransitionName: "hero-image" }}
            className={`detail-thumb blend absolute inset-x-0 top-14 bottom-20 m-auto w-[86%] h-[calc(100%-8.5rem)] lg:inset-0 lg:w-[82%] lg:h-[78%] object-contain transition-opacity duration-500 ${shown ? "hidden" : ""}`}
          />
          <div className="absolute inset-x-0 top-0 gutter h-14 flex items-center justify-between mono-label">
            <span className="flex items-center gap-2 min-w-0">
              {entry.box && <BoxBadge box={entry.box} />}
              {entry.favorite && <span className="rounded-full bg-blue text-paper font-mono text-[11px] leading-none px-2 py-1">★ Fav</span>}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 gutter pb-4 lg:pb-5 flex items-center justify-between gap-3 mono-label">
            <span className="tabular-nums text-mute">
              {position >= 0 ? `${String(position + 1).padStart(String(count).length, "0")} / ${count}` : ""}
            </span>
            {photos.length > 1 && (
              <span className="flex gap-1.5" role="group" aria-label="Photos">
                {photos.map((src, i) => (
                  <button
                    key={`${i}-${src}`}
                    onClick={() => setPhoto({ id: entry.id, index: i })}
                    aria-label={`Photo ${i + 1}`}
                    aria-pressed={i === shown}
                    className={`size-2.5 rounded-full border border-ink transition-colors ${i === shown ? "bg-ink" : "hover:bg-ink/40"}`}
                  />
                ))}
              </span>
            )}
            <span className="flex gap-2">
              <StepButton label="Previous" disabled={position <= 0} onClick={() => onStep(-1)}>←</StepButton>
              <StepButton label="Next" disabled={position < 0 || position >= count - 1} onClick={() => onStep(1)}>→</StepButton>
            </span>
          </div>
        </div>

        {/* Record */}
        <div className="lg:h-full lg:overflow-y-auto">
          <div className="sticky top-0 z-10 bg-paper/90 backdrop-blur-md gutter max-lg:pr-32 h-14 flex items-center justify-between border-b border-line">
            <span className="mono-label text-mute truncate pr-4">{entry.series}</span>
            <button onClick={close} className="group mono-label hidden lg:flex items-center gap-2 shrink-0" data-cursor="Close">
              Close
              <span className="grid place-items-center size-7 rounded-full border border-ink group-hover:bg-ink group-hover:text-paper transition-colors">
                ✕
              </span>
            </button>
          </div>

          <article className="gutter py-10 lg:py-14" key={entry.id}>
            <h2 className="text-[clamp(28px,3.3vw,52px)] leading-[1.08] tracking-[-0.035em] font-medium fade-up">
              {entry.name}
            </h2>
            {nameJa && (
              <p className="mt-3 text-mute text-[15px] fade-up" style={{ "--d": "0.08s" } as React.CSSProperties}>
                {nameJa}
              </p>
            )}

            {entry.note && (
              <figure className="mt-10 border-l-2 border-blue pl-5 fade-up" style={{ "--d": "0.1s" } as React.CSSProperties}>
                <blockquote className="font-serif italic text-[22px] sm:text-[26px] leading-snug text-ink">“{entry.note}”</blockquote>
                <figcaption className="mt-3 mono-label text-mute">Collector’s note</figcaption>
              </figure>
            )}

            <dl className="mt-10 grid grid-cols-2 border-t border-ink fade-up" style={{ "--d": "0.12s" } as React.CSSProperties}>
              {specs
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="border-b border-line py-3 pr-4 odd:border-r odd:pr-4 even:pl-4">
                    <dt className="mono-label text-mute">{k}</dt>
                    <dd className="mt-1 text-[14px] leading-snug">{v}</dd>
                  </div>
                ))}
            </dl>

            <Section title="Notes" delay={0.18}>
              {item ? (
                <p className="text-[15px] leading-[1.85] text-ink-2 max-w-[62ch]">{item.description}</p>
              ) : (
                <div className="space-y-2.5" aria-label="Loading">
                  {[100, 96, 88, 60].map((w) => (
                    <div key={w} className="h-3.5 bg-tile animate-pulse" style={{ width: `${w}%` }} />
                  ))}
                </div>
              )}
            </Section>

            {item && (item.officialUrl || item.manualUrl) && (
              <Section title="Sources">
                {item.officialUrl && <LinkRow href={item.officialUrl} label="官方商品頁面" meta="Official" />}
                {item.manualUrl && <LinkRow href={item.manualUrl} label="說明書 / 組裝手冊" meta="Manual" />}
              </Section>
            )}

            {item && item.reviews.length > 0 && (
              <Section title={`Reviews (${item.reviews.length})`}>
                {item.reviews.map((r) => (
                  <LinkRow key={r.url} href={r.url} label={r.title} meta={LANG[r.lang]} />
                ))}
              </Section>
            )}

            {item && item.youtube.length > 0 && (
              <Section title={`Films (${item.youtube.length})`}>
                {item.youtube.map((y) => (
                  <LinkRow key={y.url} href={y.url} label={y.title} meta={`▶ ${LANG[y.lang]}`} />
                ))}
              </Section>
            )}

            {item && <Secondhand key={entry.id} keyword={item.nameJa ?? item.name} />}

            <Section title="Tags">
              <div className="flex flex-wrap gap-1.5 pt-1">
                {entry.tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => onTag(t)}
                    className={`rounded-full border px-3 py-1 text-[12.5px] transition-colors ${
                      isBoxTag(t)
                        ? "border-amber/50 text-amber hover:bg-amber hover:text-paper"
                        : "border-line hover:bg-ink hover:text-paper hover:border-ink"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Section>
          </article>
        </div>
      </div>
    </div>
  )
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid place-items-center size-10 rounded-full border border-ink text-base hover:bg-ink hover:text-paper transition-colors disabled:opacity-25 disabled:pointer-events-none"
    >
      {children}
    </button>
  )
}

function Section({ title, delay = 0.22, children }: { title: string; delay?: number; children: React.ReactNode }) {
  return (
    <section className="mt-12 fade-up" style={{ "--d": `${delay}s` } as React.CSSProperties}>
      <h3 className="mono-label text-mute mb-3">{title}</h3>
      {children}
    </section>
  )
}

function LinkRow({ href, label, meta }: { href: string; label: string; meta: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[76px_minmax(0,1fr)_auto] items-baseline gap-3 py-3 border-t border-line last:border-b hover:text-blue transition-colors"
    >
      <span className="mono-label text-mute group-hover:text-blue">{meta}</span>
      <span className="text-[14px] leading-snug break-words">{label}</span>
      <span className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1">
        ↗
      </span>
    </a>
  )
}

function Secondhand({ keyword }: { keyword: string }) {
  const [data, setData] = useState<SecondhandData | null>(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    setLoading(true)
    try {
      const res = await fetch(`/api/secondhand?q=${encodeURIComponent(keyword)}`)
      setData(await res.json())
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const sites = data
    ? ([
        ["ヤフオク", data.yahoo, data.searchUrls.yahoo],
        ["まんだらけ", data.madarake, data.searchUrls.madarake],
        ["駿河屋", data.surugaya, data.searchUrls.surugaya],
      ] as const)
    : null

  return (
    <Section title="Secondhand market">
      {!sites ? (
        <button
          onClick={run}
          disabled={loading}
          className="group flex items-center gap-3 rounded-full bg-ink text-paper pl-5 pr-2 py-2 text-[13px] hover:bg-blue transition-colors disabled:opacity-60"
        >
          {loading ? "查詢中…" : "查詢二手行情"}
          <span className="grid place-items-center size-7 rounded-full bg-paper text-ink">
            {loading ? <span className="size-3 rounded-full border-2 border-ink border-t-transparent animate-spin" /> : "→"}
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-3 border-t border-ink">
          {sites.map(([name, hit, search]) => (
            <a
              key={name}
              href={hit?.url ?? search}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-b border-r last:border-r-0 border-line p-3 hover:bg-ink hover:text-paper transition-colors"
            >
              <p className="mono-label text-mute group-hover:text-paper/60">{name}</p>
              <p className="mt-2 text-[17px] font-medium tabular-nums">{hit?.price ?? "—"}</p>
              <p className="mt-1 text-[11px] text-mute group-hover:text-paper/60">{hit ? "商品頁面 ↗" : "搜尋結果 ↗"}</p>
            </a>
          ))}
        </div>
      )}
    </Section>
  )
}
