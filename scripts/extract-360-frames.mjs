#!/usr/bin/env node
// Extract evenly-spaced frames from a turntable video for the 360 viewer.
// Usage: node scripts/extract-360-frames.mjs <video-path> <item-id> [frame-count]

import { execSync } from "node:child_process"
import { mkdirSync, existsSync } from "node:fs"
import path from "node:path"

const [, , videoPath, itemId, frameCountArg] = process.argv

if (!videoPath || !itemId) {
  console.error("Usage: node scripts/extract-360-frames.mjs <video-path> <item-id> [frame-count]")
  process.exit(1)
}

const frameCount = Number(frameCountArg) || 36
const outDir = path.join("public", "images", "360", itemId)
mkdirSync(outDir, { recursive: true })

const durationStr = execSync(
  `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
)
  .toString()
  .trim()
const duration = Number(durationStr)

if (!duration || Number.isNaN(duration)) {
  console.error("Could not read video duration via ffprobe.")
  process.exit(1)
}

const interval = duration / frameCount
console.log(`Video duration: ${duration.toFixed(2)}s, extracting ${frameCount} frames every ${interval.toFixed(3)}s`)

for (let i = 0; i < frameCount; i++) {
  const t = (i * interval).toFixed(3)
  const outFile = path.join(outDir, `f${String(i).padStart(2, "0")}.jpg`)
  execSync(
    `ffmpeg -y -loglevel error -ss ${t} -i "${videoPath}" -frames:v 1 -q:v 2 "${outFile}"`
  )
}

console.log(`Done. ${frameCount} frames written to ${outDir}`)
console.log(`Add to data.ts: rotationView: { folder: "${itemId}", totalFrames: ${frameCount} }`)
