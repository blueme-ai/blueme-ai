# 二手市場查價功能 — 標準流程

## 功能概述

在 ItemModal 中加入「查詢二手價格」按鈕，點擊後同時查詢三個日本二手市場，顯示最低現貨價格與商品直連。

| 來源 | 方式 | 部署後可用? |
|------|------|------------|
| ヤフオク（Yahoo Auctions JP） | 原生 `fetch`，解析 HTML `data-auction-price` 屬性 | ✅ Vercel 可用 |
| 駿河屋（suruga-ya.jp） | `browser-act stealth-extract`（繞過 Cloudflare），`child_process.exec` 呼叫 | ❌ 本地 dev 才有 |
| まんだらけ | 無法自動化（語言選擇攔截頁，browser-act 也無效） | 僅顯示搜尋連結 |

---

## 安裝依賴

```bash
# 在 blueme-ai 專案目錄
npm install cheerio

# BrowserAct CLI（全域，Python 3.12）
uv tool install browser-act-cli --python 3.12
browser-act auth set <API_KEY>   # 從 https://www.browseract.com/reception/integrations 取得
```

---

## 關鍵技術細節

### ヤフオク 解析

搜尋 URL：
```
https://auctions.yahoo.co.jp/search/search?p=KEYWORD&auccat=0&ei=UTF-8&aucminprice=1000
```

HTML 中商品資訊在 `data-auction-*` 屬性中，非常好爬：
```html
<a class="Product__imageLink"
   data-auction-id="u1235022195"
   data-auction-price="11630"
   href="https://auctions.yahoo.co.jp/jp/auction/u1235022195">
```

抽取邏輯（TypeScript）：
```typescript
const auctionMatch = html.match(/data-auction-id="([^"]+)"[^>]*data-auction-[^>]*data-auction-price="(\d+)"/)
const auctionId = auctionMatch[1]
const price = parseInt(auctionMatch[2], 10)
// → URL: https://auctions.yahoo.co.jp/jp/auction/${auctionId}
```

### 駿河屋 解析（透過 BrowserAct）

搜尋 URL（含中古篩選器）：
```
https://www.suruga-ya.jp/search?search_word=KEYWORD&restrict[]=sale_classified=中古
```

在 Next.js API route 中用 `child_process.exec` 呼叫：
```typescript
const { stdout } = await execAsync(
  `browser-act stealth-extract "${searchUrl}" --content-type html`,
  { timeout: 30000 }
)
```

有貨商品的價格格式（**三個關鍵細節**）：
1. class 是 `price_teika`，不是 `price`（品切れ 才用 `price`）
2. 日圓符號是全形 `￥`（U+FFE5），不是一般的 `¥`（U+00A5）
3. 數字後有一個空格，再接 `</strong>`：`<strong>￥6,400 </strong>`

正確 regex：
```typescript
const priceMatch = box.match(
  /class="price_teika">\s*中古：<span[^>]*><strong>([￥¥][\d,]+)\s*<\/strong>/
)
```

item_box 分割：
```typescript
const itemBoxes = stdout.match(/<div class="item_box"[\s\S]*?(?=<div class="item_box"|$)/g) ?? []
```

### まんだらけ

- `order.mandarake.co.jp` 所有請求（含 browser-act stealth-extract）都被 302 導向語言選擇頁
- 需要有 session cookie 的有狀態瀏覽器，但 API route 是無狀態的，無法整合
- 目前只顯示搜尋連結：`https://order.mandarake.co.jp/order/listPage/list?keyword=KEYWORD&lang=ja`

---

## API Route 架構

檔案：`src/app/api/secondhand/route.ts`

```
GET /api/secondhand?q=KEYWORD
```

回傳：
```json
{
  "yahoo":    { "price": "¥12,100", "url": "https://..." } | null,
  "madarake": null,
  "surugaya": { "price": "￥6,400", "url": "https://..." } | null,
  "searchUrls": {
    "yahoo":    "https://auctions.yahoo.co.jp/search/...",
    "madarake": "https://order.mandarake.co.jp/order/...",
    "surugaya": "https://www.suruga-ya.jp/search/..."
  }
}
```

- `null` = 沒有在售商品（或 browser-act 不可用）
- 搜尋關鍵字優先用 `item.nameJa`，無則用 `item.name`

---

## UI 整合（ItemModal.tsx）

在 ItemModal 中加入三欄格：
- 有價格 → 顯示價格 + 「商品頁面」直連
- 沒有價格 → 顯示「搜尋結果」連結
- 預設不查詢（避免每次開 modal 都發請求），按鈕觸發

---

## BrowserAct Skill 安裝位置

```
~/.claude/skills/browser-act/SKILL.md
~/.claude/skills/browser-act-skill-forge/SKILL.md
```

技能來源：`https://github.com/browser-act/skills`

安裝指令（在任何 Claude Code session 執行一次即可）：
```bash
mkdir -p ~/.claude/skills/browser-act
gh api repos/browser-act/skills/contents/browser-act/SKILL.md --jq '.content' | base64 -d > ~/.claude/skills/browser-act/SKILL.md
mkdir -p ~/.claude/skills/browser-act-skill-forge
gh api repos/browser-act/skills/contents/browser-act-skill-forge/SKILL.md --jq '.content' | base64 -d > ~/.claude/skills/browser-act-skill-forge/SKILL.md
```
