---
name: add-item
description: "Add one or more collectibles (Gunpla, figures, Nendoroid/figma, superalloy, etc.) to the blueme-ai collection site. Use whenever the user shares a product name, a box/packing photo, or a list of items to add to blueme-ai, or asks to check/tag a packing box (裝箱編號)."
---

# add-item

Adds collectibles to `/Users/chengsiyang/Projects/blueme-ai/src/lib/data.ts` (the `collection: CollectibleItem[]` array) and deploys the change. This repo auto-deploys to https://blueme-ai.vercel.app on every push to `main` via Vercel's GitHub integration — a plain `git push` is the deploy step, nothing else is needed.

## Standard flow (always in this order)

1. **Identify** the item from the photo or text the user gave you.
2. **Check for duplicates** — `grep` `data.ts` for a keyword (character name, kit name, or model number). If found, tell the user "already in collection" (cite the `id`) and stop for that item. Do NOT silently skip — the user uses "already have it" as a signal to physically box up a duplicate copy.
3. **Add** — only once confirmed not present. See field-by-field rules below.

If the user gives you a batch (a text list or a box photo with many items), process every item through this same flow — don't shortcut duplicate-checking just because there are many.

## Researching each item

Prefer fetching data yourself with `WebFetch`/`Bash(curl)` over spawning subagents for a single item; for a large batch (10+), it's fine to delegate the pure lookup part (price/date/official-page/reviews) to a `haiku` model subagent via the `Agent` tool to save cost — but never delegate "is this the correct number/version/image" judgment calls to a subagent. Those need your own verification (see below). This project has a documented incident history of wrong Nendoroid/figma catalog numbers and wrong images being accepted at face value — always verify.

**Nendoroid / figma numbers:** the user's transcription from a box (or your own memory) is often wrong — off-by-one-digit typos are common. Verify the actual "No." against the Good Smile Company catalog before trusting it:
```
curl -s -A "Mozilla/5.0" "https://www.goodsmile.info/en/products/search?search%5Bquery%5D=<url-encoded name>"
```
then grep the response for `hitTtl` blocks (`href="(/en/product/\d+/)".*?<span>([^<]*)</span>`) to find the right catalog id, then `WebFetch` `https://www.goodsmile.com/en/product/<id>` (or `.info/en/product/<id>/`) and ask explicitly for "the No. printed next to the product name, distinct from the URL catalog id" — the `.info` domain sometimes only shows the internal catalog id, not the series "No.", so cross-check with `.com` or the `/ja/` page if unsure.

**Bandai P-Bandai / Gunpla kits:** `p-bandai.com` is a JS-heavy storefront; plain `curl` gets you nothing useful (empty search results, no images). Two working approaches, in order of preference:
1. `browser-act stealth-extract "https://www.google.com/search?q=<query>"` — Google's own JS-rendered result page comes back through stealth-extract with real links and an AI summary; grep the output for `p-bandai\.com/[a-z]+/item/[A-Za-z0-9]+`. This is the fastest way to find the right p-bandai item URL, and it's also how you find third-party retailer/blog images and review links when official ones are hard to reach.
2. Once you have a `p-bandai.com/tw/item/<code>` URL, `browser-act stealth-extract <url> --content-type html` gives usable price/date text AND, critically, the real product photo gallery — but only if you grab it right: the page embeds many `seller-products/<ASP-code>/*.jpg` thumbnails, most of which are an unrelated "related products" carousel (each a *different* ASP code). The actual product's own gallery is the ASP code that **repeats ~10 times** in the same fetch. `grep -oE 'seller-products/ASP[0-9]+/[A-Za-z0-9]+\.jpg\?w=1440' | sed -E 's#/[A-Za-z0-9]+\.jpg.*#/#' | sort | uniq -c | sort -rn` — the top count is the real gallery.
3. Prefer `p-bandai.com/tw/` (Taiwan store, NTD pricing, no region lock) over `.jp` (Japan-locked) per this project's existing price-format convention (`"NT$1,234（含税）"`).

**WebSearch budget:** the built-in `WebSearch` tool has a small per-session cap (default 200, raised to 600 in this user's `~/.zshrc` starting next session) shared across the whole session including subagents — once it's exhausted, WebSearch calls fail outright (not gracefully) for the rest of the session, and subagents given a research task with no other tool will just report failure. When you suspect the budget is tight or already blown, don't dispatch more `Agent` calls that rely on WebSearch — switch entirely to `browser-act stealth-extract` on Google search URLs (see above), which does not draw from that budget.

## Image rules

- **ALWAYS** fetch the real official product photo and save to `public/images/<item-id>.jpg`. Never use a Telegram photo the user sent you as the product image — those are personal/box photos for identification only.
- **Verify every image visually** (`Read` the downloaded jpg) before committing — confirm it actually shows the right character/kit, not a lookalike, not an unrelated "related product" thumbnail scraped from the same page, not a promo banner/logo. This project has had real incidents of both (a Bandai candy-page fetch once grabbed a completely different toy's thumbnail; assume it can happen again).
- Do not add an entry at all if you can't get a real verified image.
- Confirm success with `ls -la public/images/<id>.jpg` — a file **under ~10KB is almost always a broken/error-page download**, not a real photo; re-fetch from a different source.

**Bandai Gunpla images specifically:** `bandai-hobby.net` product photos are usually hosted on CloudFront (`d3bk8pkqsprcvh.cloudfront.net`) which requires a signed URL — a plain `curl` on that host returns `403 Forbidden`. Fallback chain, in order:
1. `bandai-a.akamaihd.net` (older `/bc/img/model/xl/` path) — downloadable directly if the item is old enough to be hosted there.
2. `gundamsblog.net` review pages (`https://gundamsblog.net/ガンプラ/<product-name>`) — grab the `hakoe-N.jpg`-style image, usually an 800px box-front shot.
3. `schizophonic9.com` review pages — take the first product photo.
4. Amazon Japan CDN as a last resort (possible copyright caveat — prefer the above three first).

## `description` field

- Traditional Chinese only, ~500 characters. Structure: franchise/character background → the specific item's notable features (only ones grounded in what you actually found — don't invent weapon names, part counts, or "historical firsts" you haven't verified) → collectibility/rarity note if it's a limited/P-Bandai/GSC-exclusive release.
- Don't state unverified superlatives ("the first-ever X in franchise history") unless a source actually says so — a past mistake here (claiming SMP Tetraboy was "history's first 3rd robot") had to be walked back after the user caught it.

## Series identification (`series` field)

Gemini Vision (or your own visual read) misidentifies visually-similar Gundam series more often than you'd expect — confirm before writing the entry, don't just trust the first guess:
- **機動戦士Gundam GQuuuuuuX（ジークアクス）**, **復讐のレクイエム (Requiem for Vengeance)**, and **GalactiXX** are three distinct, visually-similar series — check the box logo/series text or search the Japanese kit name against `bandai-hobby.net` to confirm which one.
- **バイアラン・カスタム (Byarlant Custom)** belongs to **機動戦士ガンダムUC (Gundam UC)**, not Vガンダム — a recurring mix-up.
- If a kit is P-Bandai exclusive, `bandai-hobby.net` search may come up empty even though it's legitimate — try `p-bandai.jp` before assuming misidentification.

## `manualUrl` field (optional)

Only **Bandai SMP/candy-toy** and **TAMASHII completed-figure lines** (超合金/CHOGOKIN, DX超合金, Figuarts, SOUL OF CHOGOKIN) have online instruction manuals. **Gunpla plastic kits do not** — don't bother searching. See `feedback_blueme_manual_field` in the user's Claude memory for the full URL-pattern writeup; short version:
- SMP/candy: `https://www.bandai.co.jp/candy/pdf/guide{year}/{10-digit-product-id}.pdf` (same id as the item's `bandai.co.jp/candy/products/{year}/{id}.html` page).
- TAMASHII: search-engine lookup only (`"<product name> 取扱説明書"` via `browser-act stealth-extract` on Google), filter for `tamashiiweb.com/storage/.../*.pdf`. Only items released 2022/4 or later have one — don't search for older ones.
- Leave the field undefined (don't add the key at all) if genuinely not found, don't guess a URL.

## Reviews & YouTube

- Max 2 each field. Language priority zh → ja → en — search using the Japanese/Chinese name first, English-name search often returns nothing for Japanese-only products.
- `reviews`: prefer 圖文開箱文 (photo-based unboxing blogs) over text-only.
- Leave `[]` if genuinely nothing found after trying all three languages — don't force a mismatched-language result just to fill the slot.

## Box/packing tags (裝箱編號)

Some items get a box-code tag in their `tags` array (e.g. `"GSC0001"`, `"BOX0007"`) when the user is physically packing them and sends a labeled photo. Rules:
- **Multiple items can own the same physical copy of a tag being applied to an already-existing entry** — if a box-tag batch includes an item that already exists in `data.ts`, add the tag to the existing entry's `tags` array; don't skip it just because it's not a new add. The user explicitly flagged this as a repeated mistake: "已經有的也要標，有可能會重複收藏，所以加裝箱標籤時不能跳過。"
- If the SAME id shows up physically in a box more than once (the user owns 2+ copies), that's just informational — one `data.ts` entry with one tag is still correct; don't duplicate the entry.
- **Before trusting your own visual read of a box-grid photo, check `src/lib/tags.ts`'s `isBoxTag()` — it only recognizes a fixed prefix whitelist** (`MACROSS`, `SMP`, `ETC`, `TF`, `合金`, `BOX`, `GSC`, `SAINT` as of 2026-07-30). If the user introduces a new prefix, add it to `BOX_TAG_PREFIXES` in that file or the tag will silently fail to render/filter on the site — this exact bug caused a long back-and-forth where tags were correctly in the data but invisible on the site.
- When given a box photo, don't assume every visually-similar box belongs to the same batch — confirm counts with the user in plain language rather than guessing ("你說這箱應該有36件，我目前標了24件，還缺12件") and let them correct you rather than silently declaring done.
- If the user says an item isn't actually in the box you tagged it into, or says they don't own an item you already added, remove the tag (or remove the whole entry, per what they actually said) rather than just leaving stale data.

## Committing and deploying

After each logical batch (not necessarily after every single item — batching 5-10 items per commit is fine and reduces noise):
```bash
cd /Users/chengsiyang/Projects/blueme-ai
npx tsc --noEmit -p .        # MUST pass with no output before committing
git add src/lib/data.ts public/images/<new-files>
git commit -m "..."          # Co-Authored-By: Claude ... <noreply@anthropic.com>
git push                     # this alone triggers the Vercel deploy — no extra deploy command needed
```
If `git push` fails with a transient error (e.g. "Internal Server Error" from GitHub), just retry once after a few seconds — it's usually not a real conflict.

## Notifying the user

This project is operated over the Telegram channel. After each deploy, message the user via the `reply` tool (never plain text output — it never reaches them) with what changed **and the site URL** `https://blueme-ai.vercel.app` — the user has explicitly asked for the link every time, not just "已部署". Flag any corrected numbers/images/duplicates found along the way; don't bury corrections silently in a big batch summary.
