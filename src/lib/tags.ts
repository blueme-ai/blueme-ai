const BOX_TAG_PREFIXES = ["macross", "smp", "etc", "TF", "合金", "BOX"]

export function isBoxTag(tag: string) {
  if (tag.startsWith("箱號") || tag.includes("@")) return true
  return BOX_TAG_PREFIXES.some((prefix) => new RegExp(`^${prefix}\\d{3,4}$`).test(tag))
}
