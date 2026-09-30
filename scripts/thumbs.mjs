// Generates listing thumbnails (public/thumbs/*.webp) from public/images.
// Runs before `next build`; thumbs are build artifacts and are not committed.
import sharp from "sharp"
import { readdir, stat, mkdir } from "node:fs/promises"
import path from "node:path"

const SRC = "public/images"
const OUT = "public/thumbs"
const SIZE = 560

await mkdir(OUT, { recursive: true })
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

let made = 0
let i = 0
async function worker() {
  while (i < files.length) {
    const f = files[i++]
    const src = path.join(SRC, f)
    const out = path.join(OUT, f.replace(/\.[^.]+$/, ".webp"))
    try {
      const [s, o] = await Promise.all([stat(src), stat(out).catch(() => null)])
      if (o && o.mtimeMs >= s.mtimeMs) continue
      await sharp(src).rotate().resize(SIZE, SIZE, { fit: "inside", withoutEnlargement: true }).webp({ quality: 74 }).toFile(out)
      made++
    } catch (e) {
      console.warn(`thumb failed: ${f} — ${e.message}`)
    }
  }
}
const t = Date.now()
await Promise.all(Array.from({ length: 8 }, worker))
console.log(`thumbs: ${made} generated, ${files.length - made} up to date (${Date.now() - t}ms)`)
