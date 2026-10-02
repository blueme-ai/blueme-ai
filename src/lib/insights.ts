import { isBoxTag } from "@/lib/tags"

// Minimal shape shared by the full records and the slim client catalogue.
type InsightSource = {
  id: string
  addedAt: string
  series: string
  manufacturer: string
  price: string
  tags: string[]
  favorite?: boolean
}

export type Count = { label: string; count: number }

export type Insights = {
  total: number
  favorites: string[]
  boxes: Count[]
  monthly: Count[] // last 12 months, oldest first, "YYYY-MM"
  topSeries: Count[]
  topMakers: Count[]
  yenTotal: number
  yenCount: number
}

const norm = (s: string) => s.replace(/[\s　・·]/g, "").toLowerCase()

// Many records carry an identical Chinese and Japanese name; showing both is just noise.
export function distinctNameJa(item: { name: string; nameJa?: string }) {
  return item.nameJa && norm(item.nameJa) !== norm(item.name) ? item.nameJa : undefined
}

// "¥26,400（税込）" → 26400; anything not priced in yen → null.
export function parseYen(price: string) {
  const m = price.match(/^¥\s*([\d,]+)/)
  return m ? Number(m[1].replace(/,/g, "")) : null
}

function top(counts: Map<string, number>, n: number): Count[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label, count }))
}

// "BANDAI SPIRITS（TAMASHII NATIONS）" and "BANDAI SPIRITS" are one maker for ranking purposes.
const stem = (s: string) => s.replace(/\s*[（(][^）)]*[）)]\s*$/, "").trim() || s

function bump(map: Map<string, number>, key: string) {
  if (key) map.set(key, (map.get(key) ?? 0) + 1)
}

export function computeInsights(items: InsightSource[], now = new Date()): Insights {
  const series = new Map<string, number>()
  const makers = new Map<string, number>()
  const boxes = new Map<string, number>()
  const months = new Map<string, number>()
  let yenTotal = 0
  let yenCount = 0

  for (const item of items) {
    bump(series, stem(item.series))
    bump(makers, stem(item.manufacturer))
    bump(months, item.addedAt.slice(0, 7))
    for (const t of item.tags) if (isBoxTag(t)) bump(boxes, t)
    const yen = parseYen(item.price)
    if (yen !== null) {
      yenTotal += yen
      yenCount++
    }
  }

  const monthly: Count[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthly.push({ label: key, count: months.get(key) ?? 0 })
  }

  return {
    total: items.length,
    favorites: items.filter((i) => i.favorite).map((i) => i.id),
    boxes: [...boxes.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "en", { numeric: true }))
      .map(([label, count]) => ({ label, count })),
    monthly,
    topSeries: top(series, 8),
    topMakers: top(makers, 8),
    yenTotal,
    yenCount,
  }
}
