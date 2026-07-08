#!/usr/bin/env node
// Identify a collectible from a box photo using Gemini (vision + Google Search grounding).
// Usage: node scripts/identify-item.mjs <image-path> ["extra hint text"]
//
// Reads the Gemini API key from ~/.claude-mem/settings.json (CLAUDE_MEM_GEMINI_API_KEY),
// the same key already configured for claude-mem's background provider.
//
// Handles ONLY identification (name/series/character/manufacturer/price/date) — tested
// 2026-07-08 and Gemini's search grounding nails these fields reliably, but any URL it
// returns (officialUrl, image links) is frequently fabricated/wrong even when it claims
// to have searched, so this script deliberately does not ask for or return URLs. Always
// independently verify + download the official product image via WebSearch/WebFetch/curl
// before adding an entry to data.ts, per feedback_blueme_data_rules.md.

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function loadApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const settingsPath = join(homedir(), ".claude-mem", "settings.json");
  const settings = JSON.parse(readFileSync(settingsPath, "utf-8"));
  const key = settings.CLAUDE_MEM_GEMINI_API_KEY;
  if (!key) throw new Error(`No Gemini API key found in ${settingsPath} or $GEMINI_API_KEY`);
  return key;
}

function mimeTypeFor(path) {
  const ext = path.toLowerCase().split(".").pop();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

const PROMPT = `You are identifying a Japanese/Asian collectible toy, figure, or model kit from a photo of its physical retail box (this may be a box side/back showing only text, not the front art).

Use Google Search to find the exact official product and verify your answer before responding — do not guess from the image alone.

Return ONLY a single JSON object (no markdown fences, no commentary) with this exact shape:
{
  "confident": true|false,
  "name": "official Japanese product name",
  "nameEn": "English name if one exists, else null",
  "series": "anime/game/franchise name",
  "character": "character or mecha name",
  "manufacturer": "e.g. Bandai Spirits / TAMASHII NATIONS, Good Smile Company, YAMATO, Arcadia, etc.",
  "scale": "e.g. 1/60, Non-Scale, etc., or null",
  "price": "e.g. ¥22,000, or null",
  "releaseDate": "e.g. 2020年3月7日, or null",
  "notes": "anything uncertain, ambiguous, or that needs human verification"
}

Do NOT include a URL or image link field — those are looked up and verified separately downstream, and any URL you invent here would be discarded, so don't waste effort on it.

If you cannot confidently identify the product, set "confident": false and explain why in "notes" rather than fabricating details.`;

async function main() {
  const [, , imagePath, hint] = process.argv;
  if (!imagePath) {
    console.error("Usage: node scripts/identify-item.mjs <image-path> [\"extra hint text\"]");
    process.exit(1);
  }

  const apiKey = loadApiKey();
  const imageBytes = readFileSync(imagePath);
  const mimeType = mimeTypeFor(imagePath);
  const base64 = imageBytes.toString("base64");

  const parts = [
    { text: hint ? `${PROMPT}\n\nAdditional hint from the user: ${hint}` : PROMPT },
    { inline_data: { mime_type: mimeType, data: base64 } },
  ];

  const body = {
    contents: [{ parts }],
    tools: [{ google_search: {} }],
    generationConfig: { temperature: 0.2 },
  };

  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Gemini API error ${res.status}: ${errText}`);
    process.exit(1);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("\n") ?? "";

  // Strip markdown code fences if Gemini added them despite instructions.
  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/```$/, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    console.log(JSON.stringify(parsed, null, 2));
  } catch {
    console.error("Could not parse Gemini response as JSON. Raw output:\n");
    console.error(text);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
