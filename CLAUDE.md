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

# ───────────────────────────────────────────────────────────────────
