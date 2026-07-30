@AGENTS.md

# ── 新電腦 / 新 Session 必讀 ──────────────────────────────────────

這是一個**個人收藏展示網站**，使用者透過 **Telegram** 傳送商品照片，
Claude Code 負責辨識商品、補全資料、部署更新，並回傳 Telegram 通知。

## 第一步：同步最新程式碼

```bash
git pull origin main
```

若有 merge conflict，先解決再繼續，**不可強制覆蓋**。

## 第二步：必讀文件（按順序）

1. **`.claude/commands/add-item.md`** — 新增商品完整 SOP（最重要）
   - 商品名稱規則、重複檢查、圖片下載（下載到本地，不外連）
   - 各品牌官網連結格式（Bandai / Good Smile / threezero / 中國品牌等）
   - Bandai CloudFront 圖片無法直接下載的備援方案
   - BOX 裝箱標籤格式（`BOX0015`）
   - reviews / youtube 搜尋規則
   - 部署指令（`npx vercel --prod --yes` 備用）
   - 部署後用 Telegram reply 工具通知用戶（**不是純文字輸出**）

2. **`.claude/skills/add-item/SKILL.md`** — 更詳細的技術說明
   - P-Bandai 商品圖片抓取方式（browser-act / stealth-extract）
   - Good Smile Nendoroid/figma 型號驗證流程
   - `manualUrl` 欄位規則
   - WebSearch 用量管理

## 關鍵技術資訊

| 項目 | 說明 |
|------|------|
| 資料主檔 | `src/lib/data.ts`（`CollectibleItem[]`，約 2 萬行） |
| 商品圖片 | `public/images/[item-id].jpg`（下載到本地，Vercel 統一提供） |
| 部署網址 | https://blueme-ai.vercel.app |
| GitHub repo | https://github.com/blueme-ai/blueme-ai |
| Telegram 通知 | 必須用 `reply` MCP tool，純文字輸出用戶看不到 |
| `price` 欄位 | 型別是 `string`，不可填 `null`，空值用 `""` |
| BOX 標籤 | `BOX` + 3～4 位數字（`BOX0015`），寫進 `tags` 陣列 |

## 工作流程（每次收到商品照片）

```
git pull
→ 讀 add-item.md
→ 辨識商品（Gemini Vision / identify-item.mjs）
→ 檢查是否重複（grep data.ts）
→ 新增資料（name / price / officialUrl / imageUrl / reviews / youtube）
→ 下載圖片到 public/images/
→ npx tsc --noEmit（必須通過）
→ git add + git commit + git push
→ npx vercel --prod --yes（若 Vercel 未自動觸發）
→ Telegram reply 通知用戶，附網址 https://blueme-ai.vercel.app
```

## 注意事項

- **Telegram 傳來的照片是包裝盒照，絕對不能用作商品圖片**
- Bandai CloudFront CDN 需簽名，直接 curl 會得到 403，改用 gundamsblog.net 評測圖
- 系列容易誤判：GQuuuuuuX ≠ 復讐のレクイエム ≠ GalactiXX；バイアラン・カスタム 是 UC 不是 Vガンダム
- 部署後確認 `public/images/[id].jpg` 大小 > 10KB，太小代表下載失敗
- **⚠️ 裝箱編號（BOX標籤）絕不能用間接推論猜測**——只因為圖片檔案剛好在本機、或時間點接近就猜箱號是真實發生過的錯誤（2026-07-30：11件被錯標BOX0013，後來證實全部不對，要重新拔標籤改標到正確的箱子）。沒看到那個箱子的實際照片就不要標，先問用戶
- **⚠️ 出貨用瓦楞紙箱常被重複利用**，箱上印的商品名不能盡信（真實案例：印著「教皇シオン」的紙箱裡裝的其實是完全不相關的城戶沙織限定品）。看起來像重複利用的紙箱（無透明視窗、只有物流標籤），要問用戶實際內容物
- **多台電腦可能同時在編輯這個 repo**——開始工作前一定要先 `git pull`，遇到別人剛推送的內容不可覆蓋，發現本機有未推送的修改要用 `git stash` 保護後再 pull，衝突時手動合併保留雙方內容

# ───────────────────────────────────────────────────────────────────
