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
    imageUrl: "/images/saber-alter-kimono.jpg",
    tags: ["Fate", "Saber Alter", "和服", "1/7", "KADOKAWA", "已購入", "有盒裝", "Heaven's Feel"],
    description: "Saber Alter（黑化的 Artoria Pendragon）以華麗和服姿態呈現的 1/7 比例完成品。原畫由武內崇繪製，最初刊登於《月刊Newtype》特刊，人物穿著帶有金色刺繡的黑色和服，左手撐開一把淺紫色油紙傘，姿態沉靜中透著不容逼近的王者氣場。\n\n服裝細節豐富——和服的絲質光澤、腰帶的立體浮雕花紋、袖口若隱若現的刺繡，均在 1/7 比例下精細重現。台座採用日式石燈籠造型，與整體和風意境融為一體。全高約 275mm（含傘及台座），是《Heaven's Feel》三部曲完結後最具話題性的衍生商品之一。此為原版 2024 年 1 月發售後的第二次再版，入手難度相對原版大幅降低。",
    reviews: [
      {
        title: "Saber Alter 和服ver. 開箱評測 — 亞洲模型玩家",
        url: "https://www.youtube.com/results?search_query=Saber+Alter+%E5%92%8C%E6%9C%8D+ver+%E9%96%8B%E7%AE%B1",
        lang: "zh",
      },
      {
        title: "セイバーオルタ 和服ver. レビュー - あみあみ",
        url: "https://www.amiami.jp/top/detail/detail?gcode=FIGURE-161870",
        lang: "ja",
      },
    ],
    youtube: [
      {
        title: "【開箱】Saber Alter 和服ver. KADOKAWA 1/7 中文評測",
        url: "https://www.youtube.com/results?search_query=Saber+Alter+%E5%92%8C%E6%9C%8D+KADOKAWA+1%2F7+%E9%96%8B%E7%AE%B1",
        lang: "zh",
      },
      {
        title: "セイバーオルタ 和服ver. 開封・彩色レビュー",
        url: "https://www.youtube.com/results?search_query=%E3%82%BB%E3%82%A4%E3%83%90%E3%83%BC%E3%82%AA%E3%83%AB%E3%82%BF+%E5%92%8C%E6%9C%8D+%E9%96%8B%E5%B0%81+%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC",
        lang: "ja",
      },
    ],
  },
  {
    id: "jeanne-alter-casual",
    name: "Avenger/Jeanne d'Arc [Alter] Casual Ver.",
    nameJa: "アヴェンジャー/ジャンヌ・ダルク〔オルタ〕 カジュアルver.",
    series: "Fate/Grand Order",
    character: "Jeanne d'Arc (Alter) / 黑聖女貞德",
    manufacturer: "Kotobukiya",
    scale: "1/7",
    price: "¥18,150",
    releaseDate: "2024年4月（再販）",
    height: "約230mm",
    officialUrl: "https://www.kotobukiya.co.jp/product/detail/p4934054058129/",
    imageUrl: "/images/jeanne-alter-casual.jpg",
    tags: ["FGO", "Fate/Grand Order", "Jeanne Alter", "黑聖女", "1/7", "Kotobukiya", "已購入", "展示中", "新宿"],
    description: "《Fate/Grand Order》第一部第一章「異聞帶 I：新宿幻靈事件」的主角之一，黑化的聖女貞德（Jeanne d'Arc Alter）以日常便服形象登場的 1/7 比例完成品。\n\n人物穿著正面有拉鍊設計的黑色皮質迷你裙，搭配深色長靴與紅黑漸層的披風型外套，頭上帶有象徵 Avenger 職階的小型王冠。身體微微前傾、腳步向前踏出，一手叉腰、一手輕提、頭微微側傾的姿勢，同時展現少女的俏皮感與 Avenger 的銳利眼神。\n\n台座為充滿廢墟感的裂紋石板地面，重現新宿廢街背景。附可替換右手臂，可切換為持劍（勝利之劍 La Pucelle）的戰鬥姿勢。此款為初版 2019 年發售後 Kotobukiya 的再版。非 ArtFX J 系列，屬 Kotobukiya 一般 PVC 1/7 完成品線。",
    reviews: [
      {
        title: "FGO 黑聖女貞德 Kotobukiya 1/7 開箱評測（中文）",
        url: "https://www.youtube.com/results?search_query=FGO+Jeanne+Alter+Casual+Kotobukiya+%E9%96%8B%E7%AE%B1+%E4%B8%AD%E6%96%87",
        lang: "zh",
      },
      {
        title: "ジャンヌ・ダルク〔オルタ〕 カジュアルver. 製品紹介 - コトブキヤ",
        url: "https://www.kotobukiya.co.jp/product/detail/p4934054058129/",
        lang: "ja",
      },
    ],
    youtube: [
      {
        title: "【開箱】黑聖女貞德 Casual Ver. Kotobukiya 1/7 評測",
        url: "https://www.youtube.com/results?search_query=Jeanne+Alter+Casual+Kotobukiya+1%2F7+%E9%96%8B%E7%AE%B1",
        lang: "zh",
      },
      {
        title: "ジャンヌ・ダルク〔オルタ〕 カジュアルver. 開封レビュー",
        url: "https://www.youtube.com/results?search_query=%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%8C%E3%82%AA%E3%83%AB%E3%82%BF+%E3%82%AB%E3%82%B8%E3%83%A5%E3%82%A2%E3%83%AB+%E3%82%B3%E3%83%88%E3%83%96%E3%82%AD%E3%83%A4+%E9%96%8B%E5%B0%81",
        lang: "ja",
      },
    ],
  },
  {
    id: "mg-turn-a-gundam-moonlight-butterfly",
    name: "MG 1/100 WD-M01 ∀ Gundam Moonlight Butterfly ver.",
    nameJa: "MG 1/100 WD-M01 ∀ガンダム ムーンライトバタフライver.",
    series: "∀ Gundam（∀ガンダム）",
    character: "WD-M01 ∀ Gundam / Turn A Gundam",
    manufacturer: "Bandai Spirits",
    scale: "1/100",
    price: "NT$1,520",
    releaseDate: "P-Bandai 限定",
    officialUrl: "https://p-bandai.com/tw/item/A2302840001",
    imageUrl: "/images/mg-turn-a-gundam-moonlight-butterfly.jpg",
    tags: ["Gundam", "∀ Gundam", "Turn A", "MG", "1/100", "Bandai", "P-Bandai限定", "有盒裝"],
    description: "富野由悠季監督 1999 年電視動畫《∀ Gundam》主角機 WD-M01 Turn A Gundam 的 MG 1/100 P-Bandai 限定特別版，主打「月光蝶（Moonlight Butterfly）」展開效果零件。\n\n月光蝶是 Turn A Gundam 潛藏的最終兵器：機體散放出無數奈米機器人形成絢爛的蝶翼光場，可以侵蝕並分解所有工業科技文明，是宇宙世紀（UC）所有鋼彈系列中公認殺傷範圍最廣的武裝之一。此版本特別附有大量透明效果零件，精細重現月光蝶展開瞬間的光翼形態，令整組完成後極具陳設觀賞價值。\n\n基礎骨架延續 MG Turn A 的精密結構，全身具備流暢可動性，除月光蝶零件外亦附有一般展示用姿勢的備用手型與武裝配件。此為 P-Bandai（Premium Bandai）限定商品，非一般通路販售。",
    reviews: [
      {
        title: "MG ∀ Gundam 月光蝶版 開箱介紹（中文）",
        url: "https://www.youtube.com/results?search_query=MG+Turn+A+Gundam+Moonlight+Butterfly+%E9%96%8B%E7%AE%B1+%E4%B8%AD%E6%96%87",
        lang: "zh",
      },
      {
        title: "MG 1/100 ∀ガンダム ムーンライトバタフライver. レビュー",
        url: "https://www.youtube.com/results?search_query=MG+Turn+A+Gundam+Moonlight+Butterfly+ver+%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC",
        lang: "ja",
      },
    ],
    youtube: [
      {
        title: "【MG 鋼彈】∀ Gundam 月光蝶 P-Bandai 限定 開箱評測",
        url: "https://www.youtube.com/results?search_query=MG+%E2%88%80+Gundam+%E6%9C%88%E5%85%89%E8%9D%B4%E8%9D%B6+P-Bandai",
        lang: "zh",
      },
      {
        title: "MG ∀ガンダム ムーンライトバタフライver. 製作・レビュー",
        url: "https://www.youtube.com/results?search_query=MG+%E2%88%80%E3%82%AC%E3%83%B3%E3%83%80%E3%83%A0+%E3%83%A0%E3%83%BC%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%88%E3%83%90%E3%82%BF%E3%83%95%E3%83%A9%E3%82%A4",
        lang: "ja",
      },
    ],
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
    officialUrl: "",
    imageUrl: "/images/macross-plus-yf21-yamato.jpg",
    tags: ["Macross", "Macross Plus", "YF-21", "1/60", "YAMATO", "可變形", "有盒裝", "絕版"],
    description: "河森正治原案、菱田正和監督的 OVA 作品《Macross Plus》（1994）中由天才試驗飛行員 Guld Goa Bowman 駕駛的次世代可變戰機原型機 YF-21，由 YAMATO 以 1/60 比例製作的完全變形完成品。\n\nYF-21 在劇中是 Macross 宇宙中最具野心的機體設計之一——採用無操縱桿的腦波控制系統（BCS, Brain Computer System），令機體直接接受駕駛員的意念指令運動。外型上以大型三角翼搭配前置鴨翼，機首修長，充滿空氣動力學美感，與競爭機 YF-19 形成截然不同的設計哲學。\n\n此 YAMATO 1/60 版本支援 Fighter（戰鬥機）、GERWALK（半變形）、Battroid（人形）三型態完全切換，機身各面板、手臂收納、機首展開等機構均以精密塑膠件組成，是 Macross 比例模型中工業設計含量極高的一款。YAMATO 品牌已於 2013 年停業，現行市場流通量稀少，收藏與增值潛力兼具，是 Macross 模型收藏家必備的里程碑作品。",
    reviews: [
      {
        title: "YAMATO 1/60 YF-21 完全變形玩具評測（中文）",
        url: "https://www.youtube.com/results?search_query=YAMATO+1%2F60+YF-21+Macross+Plus+%E4%B8%AD%E6%96%87+%E8%A9%95%E6%B8%AC",
        lang: "zh",
      },
      {
        title: "YAMATO 1/60 YF-21 マクロスプラス 完全変形 レビュー",
        url: "https://www.youtube.com/results?search_query=YAMATO+1%2F60+YF-21+%E3%83%9E%E3%82%AF%E3%83%AD%E3%82%B9%E3%83%97%E3%83%A9%E3%82%B9+%E5%AE%8C%E5%85%A8%E5%A4%89%E5%BD%A2+%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC",
        lang: "ja",
      },
    ],
    youtube: [
      {
        title: "【超罕見絕版】YAMATO 1/60 Macross Plus YF-21 三變形展示",
        url: "https://www.youtube.com/results?search_query=YAMATO+1%2F60+YF-21+Macross+Plus+%E8%AE%8A%E5%BD%A2",
        lang: "zh",
      },
      {
        title: "YAMATO 1/60 YF-21 変形動画 Fighter→GERWALK→Battroid",
        url: "https://www.youtube.com/results?search_query=YAMATO+1%2F60+YF-21+%E5%A4%89%E5%BD%A2%E5%8B%95%E7%94%BB",
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
    imageUrl: "/images/suisei-shinsei-mokuroku-vinyl.jpg",
    tags: ["星街すいせい", "Hoshimachi Suisei", "hololive", "黑膠", "Vinyl", "LP", "音樂", "專輯", "UNIVERSAL"],
    description: "VTuber 界最具代表性的歌手之一、hololive 旗下的星街すいせい（Hoshimachi Suisei）第三張個人全長專輯《新星目録》的 Vinyl LP 黑膠盤版本（2LP）。\n\n《新星目録》意為「新星的目錄/星表」，承繼前作《Specter》（2023）的暗黑電子搖滾路線，進一步拓展至更寬廣的流行曲風，收錄包括深受玩家喜愛的〈Bibbidiba〉、與製作人 Taku Inoue 合作的高能電音曲目、以及個人色彩最濃厚的抒情創作，是她音樂生涯中最全面的一次集結。\n\n封面由長期配合的插畫師繪製，以深邃宇宙藍為主調，すいせい的角色站於散落繽紛花瓣的場景中，呼應「彗星 × 新星」的視覺主軸。黑膠盤採 2LP 格式，音質與觸感均遠勝一般 CD 版本，對於同時身為 Suisei 粉絲與黑膠收藏者的樂迷而言極具紀念意義。",
    reviews: [
      {
        title: "星街すいせい《新星目録》黑膠評測 ⸺ 繁中開箱介紹",
        url: "https://www.youtube.com/results?search_query=%E6%98%9F%E8%A1%97%E3%81%99%E3%81%84%E3%81%9B%E3%81%84+%E6%96%B0%E6%98%9F%E7%9B%AE%E9%8C%B2+vinyl+%E9%96%8B%E7%AE%B1",
        lang: "zh",
      },
      {
        title: "新星目録 LP レコード レビュー",
        url: "https://www.youtube.com/results?search_query=%E6%98%9F%E8%A1%97%E3%81%99%E3%81%84%E3%81%9B%E3%81%84+%E6%96%B0%E6%98%9F%E7%9B%AE%E9%8C%B2+LP+%E3%83%AC%E3%82%B3%E3%83%BC%E3%83%89+%E9%96%8B%E5%B0%81",
        lang: "ja",
      },
    ],
    youtube: [
      {
        title: "【開箱】星街すいせい 新星目録 Vinyl LP 2LP 黑膠唱片",
        url: "https://www.youtube.com/results?search_query=Hoshimachi+Suisei+%E6%96%B0%E6%98%9F%E7%9B%AE%E9%8C%B2+vinyl+unboxing",
        lang: "zh",
      },
      {
        title: "Hoshimachi Suisei 新星目録 Vinyl Record Unboxing",
        url: "https://www.youtube.com/results?search_query=Hoshimachi+Suisei+Shinsei+Mokuroku+vinyl+LP+unboxing",
        lang: "en",
      },
    ],
  },
  {
    id: "rx783-g3-gundam-ver30-base-limited",
    name: "MG 1/100 RX-78-3 G-3 Gundam Ver.3.0 THE GUNDAM BASE LIMITED",
    nameJa: "MG 1/100 RX-78-3 G-3ガンダム Ver.3.0 THE GUNDAM BASE LIMITED",
    series: "機動戦士ガンダム（Mobile Suit Gundam, 1979）",
    character: "RX-78-3 G-3 Gundam",
    manufacturer: "Bandai Spirits",
    scale: "1/100",
    price: "¥5,500",
    releaseDate: "2022年",
    officialUrl: "https://www.gundam-base.net/products/details.php?path=01_5509",
    imageUrl: "/images/rx783-g3-gundam-ver30-base-limited.jpg",
    tags: ["Gundam", "RX-78-3", "G-3", "MG", "1/100", "Bandai", "Gundam Base限定", "有盒裝", "聯邦軍"],
    description: "《機動戰士鋼彈》（1979）中宇宙世紀地球聯邦軍所開發的初期量產型試作モビルスーツ（MS）RX-78 鋼彈第三號機，俗稱「G-3 Gundam」。G-3 是三架試作機中以「耐磁塗裝（磁力無效塗裝）」為特徵的特殊規格機，外裝塗裝以低調的灰白調為主，有別於一號機（RX-78-1）與二號機（RX-78-2）的標準紅白藍配色，因此在眾多鋼彈模型版本中獨具辨識度。\n\n此版本採用 MG Ver.3.0 骨架——這是截至目前 RX-78 系列 MG 最新世代的骨架規格，具備極為精密的全身關節構造（包括手指各節可動、腳掌踝關節自由傾斜等），並徹底重製了內部骨架造型，即使不裝外裝甲板，骨架本身也完整呈現 RX-78 的機體輪廓。外裝甲板則採用帶有金屬光澤的珍珠灰塗裝，搭配 THE GUNDAM BASE（鋼彈基地旗艦店）限定的專屬水貼，是正統派鋼彈 MG 模型中的高規格珍藏版本。",
    reviews: [
      {
        title: "MG G-3 Gundam Ver.3.0 鋼彈基地限定 中文開箱",
        url: "https://www.youtube.com/results?search_query=MG+G-3+Gundam+Ver+3.0+Gundam+Base+Limited+%E9%96%8B%E7%AE%B1+%E4%B8%AD%E6%96%87",
        lang: "zh",
      },
      {
        title: "MG RX-78-3 G-3ガンダム Ver.3.0 ガンダムベース限定 レビュー",
        url: "https://www.youtube.com/results?search_query=MG+RX-78-3+G-3+%E3%82%AC%E3%83%B3%E3%83%80%E3%83%A0+Ver+3.0+%E3%82%AC%E3%83%B3%E3%83%80%E3%83%A0%E3%83%99%E3%83%BC%E3%82%B9+%E9%99%90%E5%AE%9A+%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC",
        lang: "ja",
      },
    ],
    youtube: [
      {
        title: "【MG 鋼彈】RX-78-3 G-3 Ver.3.0 鋼彈基地限定 開箱 / 完工作品展示",
        url: "https://www.youtube.com/results?search_query=MG+RX-78-3+G3+Gundam+Ver+3.0+Gundam+Base+Limited",
        lang: "zh",
      },
      {
        title: "MG G-3 Gundam Ver.3.0 ガンダムベース限定 製作・完成レビュー",
        url: "https://www.youtube.com/results?search_query=MG+G3+Gundam+Ver+3.0+%E3%82%AC%E3%83%B3%E3%83%80%E3%83%A0%E3%83%99%E3%83%BC%E3%82%B9%E9%99%90%E5%AE%9A+%E8%A3%BD%E4%BD%9C",
        lang: "ja",
      },
    ],
  },
]
