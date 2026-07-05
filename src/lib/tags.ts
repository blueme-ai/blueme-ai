export function isBoxTag(tag: string) {
  return tag.startsWith("箱號") || tag.includes("@")
}
