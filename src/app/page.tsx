import { collection } from "@/lib/data"
import CollectionGrid from "@/components/CollectionGrid"
import { Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles size={20} className="text-indigo-400" />
            <span className="font-bold text-lg tracking-tight">blueme<span className="text-indigo-400">·ai</span></span>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">我的收藏</h1>
            <p className="text-zinc-500 text-sm mt-0.5">共 {collection.length} 件 ACG 收藏品</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-indigo-400">{collection.length}</p>
            <p className="text-xs text-zinc-500">總數</p>
          </div>
        </div>

        <CollectionGrid collection={collection} />
      </main>
    </div>
  )
}
