import { collection } from "@/lib/data"

export const dynamicParams = false

export function generateStaticParams() {
  return collection.map((item) => ({ id: item.id }))
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const item = collection.find((i) => i.id === id)
  if (!item) return Response.json({ error: "not found" }, { status: 404 })
  return Response.json(item)
}
