"use client"

import { useEffect, useRef, useState } from "react"

type RotationViewerProps = {
  folder: string // e.g. "/images/360/demo-weibritter"
  totalFrames: number
  filePrefix?: string // default "f"
  alt?: string
}

export default function RotationViewer({
  folder,
  totalFrames,
  filePrefix = "f",
  alt = "360 view",
}: RotationViewerProps) {
  const [loadedCount, setLoadedCount] = useState(0)
  const [ready, setReady] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const dragState = useRef<{ dragging: boolean; startX: number; startIndex: number } | null>(null)

  const frameUrl = (i: number) =>
    `${folder}/${filePrefix}${String(i).padStart(2, "0")}.jpg`

  useEffect(() => {
    let cancelled = false
    const imgs: HTMLImageElement[] = []
    let loaded = 0

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image()
      img.src = frameUrl(i)
      img.onload = () => {
        if (cancelled) return
        loaded++
        setLoadedCount(loaded)
        if (loaded === totalFrames) setReady(true)
      }
      img.onerror = () => {
        if (cancelled) return
        loaded++
        setLoadedCount(loaded)
        if (loaded === totalFrames) setReady(true)
      }
      imgs.push(img)
    }
    imagesRef.current = imgs

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, totalFrames])

  // drag sensitivity: full 360 drag across ~ (totalFrames * 8) px, scaled by frame count
  const pxPerFrame = Math.max(4, Math.round(600 / totalFrames))

  function handlePointerDown(clientX: number) {
    dragState.current = { dragging: true, startX: clientX, startIndex: currentIndex }
  }

  function handlePointerMove(clientX: number) {
    if (!dragState.current?.dragging) return
    const dx = clientX - dragState.current.startX
    const frameDelta = Math.round(dx / pxPerFrame)
    let next = (dragState.current.startIndex - frameDelta) % totalFrames
    if (next < 0) next += totalFrames
    setCurrentIndex(next)
  }

  function handlePointerUp() {
    if (dragState.current) dragState.current.dragging = false
  }

  return (
    <div
      className="relative w-full aspect-square bg-black rounded-xl overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
    >
      {!ready && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/80 text-zinc-300 text-sm">
          <div className="w-10 h-10 border-2 border-zinc-600 border-t-indigo-400 rounded-full animate-spin" />
          <span>
            載入中 {loadedCount} / {totalFrames}
          </span>
        </div>
      )}

      {Array.from({ length: totalFrames }).map((_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={frameUrl(i)}
          alt={alt}
          draggable={false}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${
            i === currentIndex ? "block" : "hidden"
          }`}
        />
      ))}

      {ready && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-zinc-200 text-xs tabular-nums">
          {currentIndex + 1} / {totalFrames} · 拖曳旋轉
        </div>
      )}
    </div>
  )
}
