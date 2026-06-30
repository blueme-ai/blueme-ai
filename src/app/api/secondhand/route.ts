import { NextRequest } from "next/server"
import * as cheerio from "cheerio"

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

    // Extract from data attributes — auction items use data-auction-id and data-auction-price
    const auctionMatch = html.match(/data-auction-id="([^"]+)"[^>]*data-auction-[^>]*data-auction-price="(\d+)"/)
    if (!auctionMatch) {
      // fallback: find first price + item URL pair
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

async function fetchMandarake(keyword: string): Promise<PriceResult> {
  const searchUrl = `https://order.mandarake.co.jp/order/listPage/list?keyword=${encodeURIComponent(keyword)}&lang=ja`
  try {
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ja-JP,ja;q=0.9",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(7000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const $ = cheerio.load(html)

    let price = ""
    let itemHref = ""

    $(".itemBox").each((_, el) => {
      if (price) return
      const p = $(el).find(".price").first().text().replace(/[^\d,円¥]/g, "").trim()
      const href = $(el).find("a").first().attr("href") ?? ""
      if (p && href) {
        price = p.includes("円") || p.match(/^\d/) ? p : ""
        itemHref = href
      }
    })

    if (!price) return null
    const fullUrl = itemHref.startsWith("http")
      ? itemHref
      : `https://order.mandarake.co.jp${itemHref}`
    return { price: `¥${price.replace(/[¥円]/g, "")}`, url: fullUrl }
  } catch {
    return null
  }
}

async function fetchSurugaya(keyword: string): Promise<PriceResult> {
  const searchUrl = `https://www.suruga-ya.jp/search?search_word=${encodeURIComponent(keyword)}&category=&adult_only=0`
  try {
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ja-JP,ja;q=0.9",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(7000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const $ = cheerio.load(html)

    let price = ""
    let itemHref = ""

    $(".item_box, .search_result_item").each((_, el) => {
      if (price) return
      const p =
        $(el).find(".item_price, .price").first().text().trim() ||
        $(el).find("[class*=price]").first().text().trim()
      const href =
        $(el).find(".title a, .item_title a, h2 a, h3 a").first().attr("href") ??
        $(el).find("a").first().attr("href") ??
        ""
      if (p && href) {
        const digits = p.replace(/[^\d,]/g, "")
        if (digits) {
          price = p
          itemHref = href
        }
      }
    })

    if (!price) return null
    const fullUrl = itemHref.startsWith("http")
      ? itemHref
      : `https://www.suruga-ya.jp${itemHref}`
    return { price, url: fullUrl }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")
  if (!q) return Response.json({ error: "q is required" }, { status: 400 })

  const [yahoo, madarake, surugaya] = await Promise.allSettled([
    fetchYahooAuctions(q),
    fetchMandarake(q),
    fetchSurugaya(q),
  ])

  return Response.json({
    yahoo: yahoo.status === "fulfilled" ? yahoo.value : null,
    madarake: madarake.status === "fulfilled" ? madarake.value : null,
    surugaya: surugaya.status === "fulfilled" ? surugaya.value : null,
    searchUrls: {
      yahoo: `https://auctions.yahoo.co.jp/search/search?p=${encodeURIComponent(q)}&auccat=0&ei=UTF-8`,
      madarake: `https://order.mandarake.co.jp/order/listPage/list?keyword=${encodeURIComponent(q)}&lang=ja`,
      surugaya: `https://www.suruga-ya.jp/search?search_word=${encodeURIComponent(q)}`,
    },
  })
}
