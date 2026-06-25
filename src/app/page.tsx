import { collection } from "@/lib/data"
import CollectionCard from "@/components/CollectionCard"
import { Search, Plus, Sparkles } from "lucide-react"

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

          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="搜尋收藏品..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium rounded-full px-4 py-2">
            <Plus size={15} />
            新增
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">我的收藏</h1>
            <p className="text-zinc-500 text-sm mt-0.5">共 {collection.length} 件 ACG 收藏品</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-indigo-400">{collection.length}</p>
            <p className="text-xs text-zinc-500">總數</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {collection.map((item) => (
            <CollectionCard key={item.id} item={item} />
          ))}

          {/* Add new placeholder */}
          <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-700 hover:bg-indigo-950/20 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-indigo-900/40 flex items-center justify-center transition-colors">
              <Plus size={20} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors font-medium">新增收藏品</p>
              <p className="text-xs text-zinc-600 mt-0.5">AI 自動辨識</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
