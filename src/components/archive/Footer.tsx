import type { Stats } from "./Archive"

export default function Footer({ stats }: { stats: Stats }) {
  const words = ["Gunpla", "超合金魂", "Nendoroid", "figma", "S.H.Figuarts", "聖闘士聖衣神話", "Macross", "景品", "食玩", "ZOIDS", "Transformers", "threezero"]
  return (
    <footer className="mt-32 bg-ink text-paper overflow-hidden">
      <div className="marquee-host border-b border-paper/15 py-5 overflow-hidden">
        <div className="marquee" style={{ "--dur": "50s" } as React.CSSProperties}>
          {[...words, ...words].map((w, i) => (
            <span key={i} className="shrink-0 px-6 font-serif italic text-[clamp(28px,4vw,56px)] leading-none" aria-hidden={i >= words.length}>
              {w}
              <span className="ml-12 not-italic text-blue">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="gutter pt-16 grid gap-10 sm:grid-cols-12">
        <div className="sm:col-span-6">
          <p className="mono-label text-paper/50">(03) Colophon</p>
          <p className="mt-4 text-[clamp(22px,2.4vw,34px)] leading-tight tracking-[-0.02em] max-w-xl">
            A living record of {stats.objects.toLocaleString()} objects across {stats.series.toLocaleString()} series —
            <span className="font-serif italic"> photographed, sourced and boxed.</span>
          </p>
        </div>
        <dl className="sm:col-span-6 grid grid-cols-2 gap-6 mono-label">
          <div>
            <dt className="text-paper/50">First entry</dt>
            <dd className="mt-1">{stats.since.replaceAll("-", ".")}</dd>
          </div>
          <div>
            <dt className="text-paper/50">Latest entry</dt>
            <dd className="mt-1">{stats.latest.replaceAll("-", ".")}</dd>
          </div>
          <div>
            <dt className="text-paper/50">Storage</dt>
            <dd className="mt-1">{stats.boxes} boxes</dd>
          </div>
          <div>
            <dt className="text-paper/50">Navigate</dt>
            <dd className="mt-1 flex flex-col gap-1">
              <a href="#archive" className="draw w-fit">Archive ↑</a>
              <a href="#" className="draw w-fit">Top ↑</a>
            </dd>
          </div>
        </dl>
      </div>

      <p
        aria-hidden
        className="mt-16 -mb-[0.2em] text-center font-medium tracking-[-0.075em] leading-[0.8] text-[27vw] select-none"
      >
        blueme<span className="text-blue">.</span>
      </p>
    </footer>
  )
}
