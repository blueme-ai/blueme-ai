# blueme-ai 新增商品 SOP

## 標準流程（每次都要照這個順序）
1. **辨識商品** — 從圖片或文字確認品牌、系列、型號
2. **檢查是否已有** — `grep 'id: "KEYWORD"' src/lib/data.ts`，有的話直接回報「已在收藏中」，**不要重複新增**
3. **新增** — 確認沒有才執行以下步驟（商品名、圖片、開箱文、commit）



當用戶要求新增商品到 `/Users/chengsiyang/Projects/blueme-ai/src/lib/data.ts` 時，遵守以下規則：

## 商品名稱（`name` 欄位）
- **日系玩具**（DX超合金、Metal Build、Gunpla、Arcadia、Yamato、SOC、METAL COMPOSITE、Banpresto、Taito 景品等）→ 維持**日文**商品名
- **非日系品牌**（threezero、Hot Toys、NECA 等）→ 用**中文**名稱為主（例：`threezero DLX 鋼鐵人 Mark VI`）
- 若無中日文名稱，才用英文

## `nameJa` 欄位
- 永遠填日文商品名稱

## `officialUrl`
- 優先順序：**中文版 → 日文版 → 英文版**
- 例：Good Smile 用 `goodsmile.com/zh-tw/...`，Bandai 用 `bandai-hobby.net`（日文）

## `description`
- 永遠用**繁體中文**撰寫，不需要雙語

## `reviews` 與 `youtube`（重要！）
- 新增商品後，**必須同時搜尋並填入**開箱文連結（`reviews`）和開箱影片（`youtube`）
- **各最多 2 篇**（reviews 最多 2，youtube 最多 2）
- 語系優先順序：**zh → ja → en**（優先找中文，找不到換日文，再找不到才用英文）
- 不需要每種語系都涵蓋——有中文就用中文，沒有就找日文，都沒有才用英文
- 找不到才留 `[]`
- **搜尋時用中文或日文商品名搜尋**（用英文名往往找不到）——以 `name` 或 `nameJa` 欄位的文字作為搜尋關鍵字

## 商品圖片（重要！）
- 新增商品後，**必須立即**從官方網站抓取商品主圖
- 儲存到 `/Users/chengsiyang/Projects/blueme-ai/public/images/[item-id].jpg`
- 使用 curl 下載：`curl -L -o "/Users/chengsiyang/Projects/blueme-ai/public/images/[id].jpg" "[image-url]"`
- **不可要求用戶自行上傳圖片**
- **⚠️ 嚴禁使用 Telegram 傳來的照片作為商品圖片**——用戶傳圖是為了「辨識商品」用，那是用戶自己拍的包裝盒照，絕對不能直接儲存為商品圖。**一定要去官網抓官方商品圖。**

## 圖片來源參考
| 品牌 | 官方圖片來源 |
|------|------------|
| Bandai Tamashii | tamashiiweb.com 商品頁 og:image |
| Bandai Gunpla | bandai-hobby.net 或 p-bandai.jp |
| Good Smile (Nendoroid/Scale) | goodsmile.com/zh-tw/product/... |
| threezero DLX | threezerohk.com/shop/... |
| Arcadia / Yamato | arcadiashop.jp |
| Mega House | megahouse.co.jp |

## 官網連結格式參考（`officialUrl`）

### Bandai Gunpla
- **優先使用 bandai-hobby.net**：`https://bandai-hobby.net/item/01_XXXX/`（不論是否為 P-Bandai 限定，只要有頁面就用這個）
- **bandai-hobby.net 找不到才改用 p-bandai.jp**：`https://p-bandai.jp/item/item-NNNNNNNNNN/`
- p-bandai.jp 有鎖區問題，非必要不用

### threezero DLX
- **正確格式**：`https://www.threezerohk.com/shop/[product-slug]-[id]`
- 範例：`https://www.threezerohk.com/shop/marvel-studios-the-infinity-saga-dlx-iron-man-mark-7-6753`
- `/product/` 舊格式已全部失效（403），**不要使用**
- 若找不到 `/shop/` URL，用 Google 搜尋 `site:threezerohk.com/shop [商品名]`

### Bandai Tamashii（DX超合金、Metal Build 等）
- `https://tamashiiweb.com/item/XXXX/`

### Good Smile（Nendoroid、Scale）
- 優先用繁中：`https://www.goodsmile.com/zh-tw/product/XXXX/`

### 其他品牌
- 優先找官方直營網站中文版 → 日文版 → 英文版

## 部署
- 新增完成後 `git add` + `git commit` + `git push`
- Vercel 會自動部署

## 常用 ID 命名規則
- 品牌-系列-型號：`dx-chogokin-vf1j-hikaru`、`dlx-iron-man-mark85`、`mg-aile-strike-gundam`
- 全部小寫 + 連字號，不用底線
