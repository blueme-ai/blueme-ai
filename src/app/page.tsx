import { collection } from "@/lib/data"
import { buildCatalog } from "@/lib/catalog"
import Archive from "@/components/archive/Archive"

export default function Home() {
  const catalog = buildCatalog(collection)
  const stats = {
    objects: catalog.length,
    makers: new Set(catalog.map((c) => c.maker)).size,
    series: new Set(catalog.map((c) => c.series)).size,
    boxes: new Set(catalog.flatMap((c) => (c.box ? [c.box] : []))).size,
    since: catalog[0]?.addedAt ?? "",
    latest: catalog[catalog.length - 1]?.addedAt ?? "",
  }
  return <Archive catalog={catalog} stats={stats} />
}
