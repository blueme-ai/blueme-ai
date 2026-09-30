import { Package } from "lucide-react"

// Storage box label (BOX0015, SAINT0003 …) — must stay legible even on small thumbnails.
export default function BoxBadge({ box, className = "" }: { box: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber text-paper font-mono text-[11px] font-medium leading-none tracking-wide px-2 py-1 whitespace-nowrap ${className}`}
    >
      <Package size={11} strokeWidth={2.25} aria-hidden />
      <span className="sr-only">箱號 </span>
      {box}
    </span>
  )
}
