// Fade images in once decoded; also covers images that finished before hydration.
export function fadeRef(img: HTMLImageElement | null) {
  if (!img) return
  const done = () => img.setAttribute("data-loaded", "")
  if (img.complete && img.naturalWidth > 0) done()
  else {
    img.addEventListener("load", done, { once: true })
    img.addEventListener("error", function onError() {
      // Thumbnail missing → fall back to the original once, then give up.
      const full = img.dataset.full
      if (full && img.getAttribute("src") !== full) {
        img.src = full
        img.addEventListener("error", onError, { once: true })
      } else img.setAttribute("data-error", "")
    }, { once: true })
  }
}
