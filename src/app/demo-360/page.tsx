import RotationViewer from "@/components/RotationViewer"

export default function Demo360Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center gap-6 p-6">
      <div className="max-w-md w-full">
        <h1 className="text-lg font-bold mb-1">360° 檢視 Demo</h1>
        <p className="text-sm text-zinc-400 mb-4">
          用滑鼠拖曳（或手機觸控滑動）左右拖動下方圖片試試。這組素材是拿現有商品圖用 ffmpeg
          做的假旋轉測試（不是真的360度拍攝），純粹展示拖曳換圖的機制跟手感。
        </p>
        <RotationViewer folder="/images/360/demo-weibritter" totalFrames={36} filePrefix="f" alt="HG Weibritter demo" />
      </div>
    </div>
  )
}
