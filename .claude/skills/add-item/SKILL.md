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

**Bandai SMP/candy-toy**, **TAMASHII completed-figure lines** (超合金/CHOGOKIN, DX超合金, Figuarts, SOUL OF CHOGOKIN, METAL BUILD, PROPLICA, HI-METAL R), and **Gunpla plastic kits** all have online instruction manuals. (Correction 2026-08-07: an earlier note here said Gunpla kits have none — that was wrong. `manual.bandai-hobby.net` hosts a full searchable Gunpla manual database; see its own section below.) See `feedback_blueme_manual_field` in the user's Claude memory for background; full lookup procedure below (last verified 2026-08-07).

### SMP / candy-toy line

Primary pattern: `https://www.bandai.co.jp/candy/pdf/guide{year}/{product-id}.pdf`, where `{product-id}` is the same id segment as the item's `bandai.co.jp/candy/products/{year}/{id}.html` official page (works whether that id is a plain 10-digit number or a longer JAN-derived string). `curl -sI` and confirm `content-type: application/pdf` (may render as `Application/pdf`, still valid) before trusting it.

If that 404s, the real file may live under a different folder/id than the product page uses — WebFetch the product page itself and look for the "WEB取り扱い説明書はこちら" button's actual href. Seen variants in the wild: `pdf/2107smp/{id}.pdf` (2021-era SMP items), or a manual id that doesn't match the product-page id at all (e.g. one SMP item's page used id `1000162722` but its real manual was filed under `1000165077`). Always verify with `curl -sI` — never guess-and-ship a folder/id combo that hasn't returned `200 application/pdf`.

### TAMASHII completed-figure line (超合金魂/DX超合金/Figuarts/etc.)

**Only items released 2022/4 or later** have a manual on tamashiiweb.com — this is a hard cutoff confirmed by the site's own manual-search page. Don't spend time searching pre-2022/4 items against tamashiiweb.

Pattern: `https://tamashiiweb.com/storage/images/products/imported/item_{10-digit-item-id}_{random-string}_300.pdf`. The `{item-id}` is the numeric id from the item's `tamashiiweb.com/item/{id}/` page (zero-padded to 10 digits); the `{random-string}` segment is not guessable and must be found per-item — WebSearch `"<product name> 取扱説明書"` or `"<product name> PDF"` and look for a matching `tamashiiweb.com/storage/.../*.pdf` link, or WebFetch/`curl` the item page directly and grep for `/storage/images/products/imported/item_{item-id}` in the HTML (og:image and manual links usually share the same random string per item, so the product photo URL can hint at it, but always verify the manual URL itself separately — don't assume they're identical). Verify with `curl -sI` for `content-type: application/pdf`.

### METAL BUILD / PROPLICA / HI-METAL R — use the tamashiiweb manual index instead of WebSearch

For these lines, tamashiiweb.com has an actual browsable index of every manual, filterable by brand: `https://tamashiiweb.com/support/manual/?br={brand_slug}` (e.g. `metal_build,proplica` — comma-joined for multiple brands). This is **much more reliable than WebSearch guessing** because it gives you the canonical product name next to each PDF link directly, so matching is a straight name comparison instead of inferring from search snippets.

Fetch it with `browser-act stealth-extract <url> --content-type markdown` (no proxy needed, this site isn't geo-blocked). Caveat: the page's pagination (`&p=2`, `&p=3`, ...) is JS/client-state driven, not server-side — repeated `stealth-extract` calls with different `p=` values tend to all return page 1's content again (confirmed empirically: 6 "different" page fetches yielded only 98 unique entries out of a claimed 118, i.e. duplicate scraping, not full coverage). Treat this route as good-but-partial coverage, not exhaustive — items you can't find in a few scraped pages may still exist further in, but chasing full pagination coverage via repeated stealth-extract isn't worth the effort; falling back to per-item WebSearch for the stragglers is fine.

Also note: the site alternates between rendering product names in Japanese and English/Chinese across calls (locale isn't sticky) — match on keywords (e.g. "PROVIDENCE" / "プロヴィデンス") rather than assuming a consistent script.

### Gunpla plastic kits — manual.bandai-hobby.net

**Correction (2026-08-07): earlier guidance here said Gunpla kits have no online manuals — that was wrong and cost real search time before being caught.** `https://manual.bandai-hobby.net/` is a dedicated, searchable Gunpla manual database (product name / 品番 / JAN code search, plus release-date/brand/series filters). Each result links to `manual.bandai-hobby.net/menus/detail/{id}`.

**Use the `menus/detail/{id}` page as `manualUrl`, not a direct PDF link.** A direct PDF (`manual.bandai-hobby.net/pdf/{id}.pdf`) does exist and works, but the detail page is the correct target: special/limited editions often ship a `取扱説明書` (main manual) *and* a separate `補足説明書` (supplement covering just what differs from the standard release) — linking straight to one PDF silently drops the other. User confirmed this preference explicitly (2026-08-07) after noticing a limited-edition kit (detail id 4325) has exactly this two-document setup.

Search mechanics (reverse-engineered 2026-08-07, no browser session needed once known):
- The site's search form is plain GET despite looking JS-driven: `https://manual.bandai-hobby.net/?sort=new&freeword={query}&sy=&sm=&ey=&em=` — `curl` it directly, no JS rendering required for results.
- **Keep the query short — a single core CJK term only.** Long queries (full product name plus English/version suffixes, e.g. `"RX-78-3 G-3ガンダム Ver.3.0 THE GUNDAM BASE LIMITED"`) return **zero** results; the search appears to be doing a strict multi-token AND match that breaks easily. Strip to just the katakana/kanji mecha or character name (e.g. `G-3ガンダム`) and re-filter candidates yourself.
- Results are server-rendered HTML list items: `<a href="/menus/detail/{id}">` containing `<div class="bl_result_name">{Japanese name}<span class="bl_result_name_en">{English name}</span></div>` and a `<dd>{release date}</dd>`. Match candidates against the target by exact normalized name (strip whitespace/fullwidth-halfwidth differences) — **do not** loosely substring-match, this line has the same version-confusion risk as everything else here (Ver.Ka vs Ver.2.0 vs base, standard vs Gundam Base限定 vs color variants of the same kit number all coexist as separate results for a shared base name).
- Roughly a third of MG-line catalog entries have no usable Japanese name (`nameJa` missing or Latin-only) to search with at all — those need a different approach (derive the Japanese kit name from the official page, or skip).

Only a partial MG-grade pass has been done as of 2026-08-07 (11 of 115 MG items confirmed) — scope is large (Gunpla is the biggest category in the catalog) and the rest of MG plus all other grades (HG/RG/PG/etc.) haven't been swept.

### Pre-2022/4 TAMASHII items — support.bandaispirits.co.jp archive (fallback)

tamashiiweb explicitly hands off pre-2022/4 manuals to an external site: **support.bandaispirits.co.jp**. This site is **geo-blocked to Japan IPs** — plain `curl`/`WebFetch` return a bare `403 Forbidden` (102-byte nginx error page) even for the homepage. Access it via `browser-act stealth-extract <url> --dynamic-proxy JP` instead (a Japan-region dynamic proxy is enough; no persistent browser needs to be created for this — `stealth-extract` alone bypasses the geo-block per call).

Procedure:
1. WebSearch `site:support.bandaispirits.co.jp {product name}` — results are titled `【取扱説明書】{product name}` at `https://support.bandaispirits.co.jp/s/article/{article_id}` (article_id is either a 13-digit JAN-like number or a short internal id like `000000943`).
2. The actual PDF is hosted **unblocked, no proxy needed** at a fixed S3 path derived from that article_id: `https://bsp-354831313727-cs-public.s3.ap-northeast-1.amazonaws.com/docs/answers/url/{article_id}.pdf`. `curl -sI` it directly — some article_ids 403 here too (manual genuinely not digitized), most legacy `000000xxx`-style ids do.
3. **Before trusting a match, fetch the article page itself** (`browser-act stealth-extract "https://support.bandaispirits.co.jp/s/article/{id}" --content-type html --dynamic-proxy JP`, then grep for `【取扱説明書】[^<"]+`) and compare the *exact* title against the target product's *exact* variant name.

**This last step is not optional.** Real-world hit rate on a from-scratch sweep of ~220 old items was ~7% after filtering — and roughly a third of the search-suggested "matches" before filtering were wrong-variant mismatches, not genuine misses. Confirmed failure modes, all for the *same* character/model code:
- `リニューアルバージョン` (renewal) vs `(Tokyo Limited)` vs plain `R` suffix — different releases, different manuals (e.g. GX-01R, GX-02R, GX-40 all tripped this).
- Base `聖闘士聖衣神話` line vs `聖闘士聖衣神話EX` (Exceed Model) reissue — same character, different physical product, almost never share a manual. If the target name has no "EX" and the only article found does, that's a mismatch, not a hit.
- `初期青銅聖衣`/`最終青銅聖衣` (initial/final bronze cloth) and plain vs `＜リバイバル版＞` (revival reissue) — same character, different release year, different product. A catalog entry's `releaseDate` is a useful tell: if it says e.g. 2003/2004 and the matched article title says `＜リバイバル版＞`, that revival came out years later — wrong product, drop it.

When delegating this search to a sub-agent, tell it explicitly to under-report ("not found") rather than guess on any of the above ambiguities, and to verify the exact article title — then re-verify its "found" results yourself before writing them to `data.ts`, since even careful agents will occasionally hand back a title-mismatched URL.

### General rule

Leave the field undefined (don't add the key at all) if genuinely not found — don't guess a URL, and don't apply a URL whose fetched title doesn't exactly match the target item's variant.

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
- **Never assign a box tag from a proxy signal instead of an actual photo of that box's contents.** A real incident (2026-07-30): 11 items were tagged `BOX0013` purely because their downloaded images happened to be sitting locally and were "probably" worked on around the same time — no one had actually looked at what was in BOX0013. When the user later sent real photos, none of the 11 matched; all had to be un-tagged and re-tagged into the box they actually belonged to (BOX0014). If you don't have a photo of the specific box, don't guess a box tag — leave it off and ask.
- **Printed text on a shipping carton is not proof of its contents.** Carton boxes get reused to ship something unrelated to what's printed on them — a real incident: a plain kraft box printed "聖闘士聖衣神話「教皇シオン」スペシャルセット" actually contained an unrelated campaign-exclusive Saori Kido figure. When a box looks like generic reused packaging (plain kraft carton, shipping labels, no clear-window showing the actual product), don't trust the printed product name — ask the user what's actually inside, or wait for a photo of the unwrapped contents.
- After tagging a batch, it's worth a final sanity pass: for each item you just tagged, could you point to the specific photo that showed it in that specific box? If not, it shouldn't have the tag yet.

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
