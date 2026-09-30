import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "blueme — The Private Archive",
  description: "一座私人 ACG 收藏典藏庫：模型、可動、景品與超合金，逐件建檔。",
}

export const viewport: Viewport = {
  themeColor: "#efede6",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={`${geistSans.variable} ${geistMono.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
