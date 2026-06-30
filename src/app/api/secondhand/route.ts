import { NextRequest } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

type PriceResult = {
  price: string
  url: string
} | null

async function fetchYahooAuctions(keyword: string): Promise<PriceResult> {
  const searchUrl = `https://auctions.yahoo.co.jp/search/search?p=${encodeURIComponent(keyword)}&auccat=0&ei=UTF-8&aucminprice=1000`
  try {
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ja-JP,ja;q=0.9",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const html = await res.text()

    const auctionMatch = html.match(/data-auction-id="([^"]+)"[^>]*data-auction-[^>]*data-auction-price="(\d+)"/)
    if (!auctionMatch) {
      const pm = html.match(/data-auction-price="(\d+)"/)
      const hm = html.match(/href="(https:\/\/auctions\.yahoo\.co\.jp\/jp\/auction\/[^"]+)"/)
      if (!pm || !hm) return null
      const p = parseInt(pm[1], 10)
      if (p < 100) return null
      return { price: `¥${p.toLocaleString("ja-JP")}`, url: hm[1] }
    }
    const auctionId = auctionMatch[1]
    const price = parseInt(auctionMatch[2], 10)
    if (price < 100) return null
    return {
      price: `¥${price.toLocaleString("ja-JP")}`,
      url: `https://auctions.yahoo.co.jp/jp/auction/${auctionId}`,
    }
  } catch {
    return null
  }
}

// Uses browser-act stealth-extract (bypasses Cloudflare) — works when browser-act CLI is available
async function fetchSurugayaViaStealth(keyword: string): Promise<PriceResult> {
  // Add 中古 filter to only search used/secondhand items
  const searchUrl = `https://www.suruga-ya.jp/search?search_word=${encodeURIComponent(keyword)}&restrict%5B%5D=sale_classified%3D%E4%B8%AD%E5%8F%A4`
  try {
    const { stdout } = await execAsync(
      `browser-act stealth-extract "${searchUrl}" --content-type html`,
      { timeout: 30000 }
    )
    // In-stock used items: <p class="price_teika">中古：<span class="text-red"><strong>¥X,XXX</strong>
    const itemBoxes = stdout.match(/<div class="item_box"[\s\S]*?(?=<div class="item_box"|$)/g) ?? []
    for (const box of itemBoxes) {
      // Match 中古 price inside price_teika (Surugaya uses fullwidth ¥ U+FFE5, price has trailing space)
      const priceMatch = box.match(/class="price_teika">\s*中古：<span[^>]*><strong>([￥¥][\d,]+)\s*<\/strong>/)
      const urlMatch = box.match(/href="(https:\/\/www\.suruga-ya\.jp\/product\/detail\/[^"?]+)"/)
      if (priceMatch && urlMatch) {
        return { price: priceMatch[1], url: urlMatch[1] }
      }
    }
    return null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")
  if (!q) return Response.json({ error: "q is required" }, { status: 400 })

  const [yahoo, surugaya] = await Promise.allSettled([
    fetchYahooAuctions(q),
    fetchSurugayaViaStealth(q),
  ])

  return Response.json({
    yahoo: yahoo.status === "fulfilled" ? yahoo.value : null,
    madarake: null,
    surugaya: surugaya.status === "fulfilled" ? surugaya.value : null,
    searchUrls: {
      yahoo: `https://auctions.yahoo.co.jp/search/search?p=${encodeURIComponent(q)}&auccat=0&ei=UTF-8`,
      madarake: `https://order.mandarake.co.jp/order/listPage/list?keyword=${encodeURIComponent(q)}&lang=ja`,
      surugaya: `https://www.suruga-ya.jp/search?search_word=${encodeURIComponent(q)}`,
    },
  })
}
