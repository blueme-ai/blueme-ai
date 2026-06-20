export type ReviewLink = {
  title: string
  url: string
  lang: "zh" | "ja" | "en"
}

export type CollectibleItem = {
  id: string
  name: string
  nameJa?: string
  series: string
  character: string
  manufacturer: string
  scale: string
  price: string
  releaseDate: string
  height?: string
  officialUrl: string
  imageUrl: string
  tags: string[]
  description: string
  reviews: ReviewLink[]
  youtube: ReviewLink[]
}

export const collection: CollectibleItem[] = [
  {
    id: "saber-alter-kimono",
    name: "Saber Alter 和服ver.",
    nameJa: "セイバーオルタ 和服ver.",
    series: "Fate/stay night [Heaven's Feel]",
    character: "Saber Alter",
    manufacturer: "KADOKAWA",
    scale: "1/7",
    price: "¥26,400",
    releaseDate: "2026年3月（第二次再販）",
    height: "約275mm（含傘及台座）",
    officialUrl: "https://www.goodsmile.com/zh/product/7068/Saber+Alter+%E5%92%8C%E6%9C%8Dver.",
    imageUrl: "https://images.goodsmile.com/cgm/images/product/20231101/14265/108419/large/79dff8fa57e2a8f3e4ba1ab0baf32e76.jpg",
    tags: ["Fate", "Saber", "和服", "1/7", "KADOKAWA", "已購入", "有盒裝"],
    description: "Saber Alter 的和服造型，原創插圖由武內崇繪製並刊登於《月刊Newtype》。人物穿著黑色和服，手持油紙傘，氣質高雅又充滿力量感。全高約275mm（含傘及台座），是《Fate/stay night [Heaven's Feel]》系列中的經典收藏品。",
    reviews: [
      {
        title: "セイバーオルタ 和服ver. レビュー - あみあみ",
        url: "https://www.amiami.jp/top/detail/detail?gcode=FIGURE-161870",
        lang: "ja",
      },
    ],
    youtube: [
      {
        title: "Saber Alter 和服ver. 開封レビュー",
        url: "https://www.youtube.com/results?search_query=Saber+Alter+%E5%92%8C%E6%9C%8D+ver+%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC",
        lang: "ja",
      },
    ],
  },
  {
    id: "jeanne-alter-casual",
    name: "Avenger/Jeanne d'Arc [Alter] Casual Ver.",
    nameJa: "アヴェンジャー/ジャンヌ・ダルク〔オルタ〕 カジュアルver.",
    series: "Fate/Grand Order",
    character: "Jeanne d'Arc (Alter)",
    manufacturer: "Kotobukiya",
    scale: "1/7",
    price: "¥18,150",
    releaseDate: "2024年4月（再販）",
    height: "約230mm",
    officialUrl: "https://www.kotobukiya.co.jp/product/detail/p4934054058129/",
    imageUrl: "https://www.kotobukiya.co.jp/wp-content/uploads/2024/01/p4934054058129_01.jpg",
    tags: ["FGO", "Fate/Grand Order", "Jeanne Alter", "1/7", "Kotobukiya", "已購入", "展示中"],
    description: "Jeanne d'Arc [Alter] 的日常便服造型，來自《Fate/Grand Order》「異聞帶 I ：新宿幻靈事件」劇情。人物以頭微傾、腳向前踏出的姿勢展現女性優雅與在新宿廢墟中的銳利氣息。附可替換右手臂，可展示持劍姿勢。非 ArtFX J 系列，屬 Kotobukiya 一般 PVC 塗裝完成品系列。",
    reviews: [
      {
        title: "ジャンヌ・ダルク〔オルタ〕 カジュアルver. レビュー",
        url: "https://www.kotobukiya.co.jp/product/detail/p4934054058129/",
        lang: "ja",
      },
    ],
    youtube: [
      {
        title: "Jeanne d'Arc Alter Casual Ver. 開封動画",
        url: "https://www.youtube.com/results?search_query=Jeanne+Alter+Casual+Ver+Kotobukiya+review",
        lang: "ja",
      },
    ],
  },
  {
    id: "mg-turn-a-gundam-butterfly",
    name: "MG 1/100 WD-M01 ∀ Gundam Moonlight Butterfly ver.",
    nameJa: "MG 1/100 WD-M01 ∀ガンダム ムーンライトバタフライver.",
    series: "∀ Gundam（∀ガンダム）",
    character: "WD-M01 ∀ Gundam / Turn A Gundam",
    manufacturer: "Bandai Spirits",
    scale: "1/100",
    price: "待確認",
    releaseDate: "待確認（P-Bandai限定）",
    officialUrl: "https://p-bandai.jp/",
    imageUrl: "",
    tags: ["Gundam", "∀ Gundam", "Turn A", "MG", "1/100", "Bandai", "P-Bandai限定", "有盒裝"],
    description: "∀ Gundam（∀ガンダム）MG 1/100 限定版，附「月光蝶（Moonlight Butterfly）」展開效果零件，重現 WD-M01 散開奈米機器人光翼的經典場景。此版本為 P-Bandai 網路限定商品，是 Turn A Gundam 收藏品中極具話題性的一款。",
    reviews: [],
    youtube: [],
  },
  {
    id: "macross-plus-yf21-yamato",
    name: "Macross Plus YF-21 1/60 Fully Transformable",
    nameJa: "マクロスプラス 1/60 完全変形 YF-21",
    series: "Macross Plus（マクロスプラス）",
    character: "YF-21（Guld Goa Bowman 機）",
    manufacturer: "YAMATO",
    scale: "1/60",
    price: "¥19,800（原廠建議售價）",
    releaseDate: "2008年",
    officialUrl: "https://www.yamato-toys.com/",
    imageUrl: "",
    tags: ["Macross", "Macross Plus", "YF-21", "1/60", "YAMATO", "可變形", "有盒裝"],
    description: "《Macross Plus》中 Guld Goa Bowman 駕駛的試作可變戰機 YF-21，由 YAMATO 以 1/60 比例製作，支援完全變形（Fighter / GERWALK / Battroid 三型態切換）。收藏價值高，已停產絕版，是 Macross 收藏品中的名作之一。",
    reviews: [],
    youtube: [
      {
        title: "YAMATO 1/60 YF-21 完全変形レビュー",
        url: "https://www.youtube.com/results?search_query=Yamato+1%2F60+YF-21+Macross+Plus+review",
        lang: "ja",
      },
    ],
  },
  {
    id: "suisei-shinsei-mokuroku-vinyl",
    name: "新星目録 Vinyl LP",
    nameJa: "新星目録（しんせいもくろく）",
    series: "星街すいせい（Hoshimachi Suisei）",
    character: "星街すいせい",
    manufacturer: "UNIVERSAL MUSIC JAPAN",
    scale: "—",
    price: "¥6,050（2LP）",
    releaseDate: "2025年1月22日",
    officialUrl: "https://suisei-music.com/",
    imageUrl: "",
    tags: ["星街すいせい", "Hoshimachi Suisei", "hololive", "黑膠", "Vinyl", "音樂", "專輯"],
    description: "星街すいせい（Hoshimachi Suisei）第三張個人專輯《新星目録》的黑膠版本（Vinyl LP）。專輯於 2025 年 1 月 22 日發行，封面插圖由すいせい本人監修，以深邃宇宙色調搭配繽紛花瓣展現彗星美學，是她迄今最完整的創作合輯。",
    reviews: [],
    youtube: [
      {
        title: "新星目録 Vinyl Unboxing",
        url: "https://www.youtube.com/results?search_query=%E6%98%9F%E8%A1%97%E3%81%99%E3%81%84%E3%81%9B%E3%81%84+%E6%96%B0%E6%98%9F%E7%9B%AE%E9%8C%B2+vinyl",
        lang: "ja",
      },
    ],
  },
  {
    id: "rx783-g3-gundam-ver30-base-limited",
    name: "MG 1/100 RX-78-3 G-3 Gundam Ver.3.0 THE GUNDAM BASE LIMITED",
    nameJa: "MG 1/100 RX-78-3 G-3ガンダム Ver.3.0 THE GUNDAM BASE LIMITED",
    series: "機動戦士ガンダム（Mobile Suit Gundam）",
    character: "RX-78-3 G-3 Gundam",
    manufacturer: "Bandai Spirits",
    scale: "1/100",
    price: "¥5,500",
    releaseDate: "2022年",
    officialUrl: "https://www.gundam-base.net/",
    imageUrl: "",
    tags: ["Gundam", "RX-78-3", "G-3", "MG", "1/100", "Bandai", "Gundam Base限定", "有盒裝"],
    description: "原版 RX-78-2 鋼彈的第三號試作機 RX-78-3（G-3 Gundam），以 MG Ver.3.0 全新骨架重製，外裝採用帶有金屬光澤的灰色塗裝，並以 THE GUNDAM BASE 限定形式發售。Ver.3.0 骨架具備細膩的內部結構細節與優秀的可動性，是正統派鋼彈 MG 收藏必備品。",
    reviews: [],
    youtube: [
      {
        title: "MG G-3 Gundam Ver.3.0 Gundam Base Limited レビュー",
        url: "https://www.youtube.com/results?search_query=MG+RX-78-3+G3+Gundam+Ver+3.0+Gundam+Base+Limited",
        lang: "ja",
      },
    ],
  },
]
