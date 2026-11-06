import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import subsetFont from 'subset-font'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const fontkit = require('fontkit')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const branding = JSON.parse(fs.readFileSync(path.join(root, 'src/branding.json'), 'utf8'))
const fontVersion = String(branding.fontVersion || '1')
const publicFonts = path.join(root, 'public/fonts')
const sourceDir = path.join(root, 'scripts/font-src')
const textExt = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.html', '.css', '.md', '.svg', '.txt'])
const skipDir = new Set(['node_modules', 'dist', '.git', '.venv', 'font-src', 'assets'])

const SOURCE = {
  'NotoSansSC-Regular.otf': {
    url: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@Sans2.004/Sans/SubsetOTF/SC/NotoSansSC-Regular.otf'
  },
  'NotoSansSC-Bold.otf': {
    url: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@Sans2.004/Sans/SubsetOTF/SC/NotoSansSC-Bold.otf'
  },
  'NotoSerifSC-SemiBold.otf': {
    url: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@Serif2.003/Serif/SubsetOTF/SC/NotoSerifSC-SemiBold.otf'
  }
}

const OUTPUTS = [
  { source: 'NotoSansSC-Regular.otf', base: 'noto-sans-sc-400', family: 'Noto Sans SC', weight: 400 },
  { source: 'NotoSansSC-Bold.otf', base: 'noto-sans-sc-600', family: 'Noto Sans SC', weight: 600 },
  { source: 'NotoSerifSC-SemiBold.otf', base: 'noto-serif-sc-600', family: 'Noto Serif SC', weight: 600 }
]

function isUsefulChar (ch) {
  const o = ch.codePointAt(0)
  if (o <= 0x7f) return false
  if (o >= 0x4e00 && o <= 0x9fff) return true
  if (o >= 0x3400 && o <= 0x4dbf) return true
  if (o >= 0xff00 && o <= 0xffef) return true
  if (o >= 0x3000 && o <= 0x303f) return true
  const extras = new Set([
    0x00b7, // ·
    0x2014, 0x2013, 0x2026,
    0x201c, 0x201d, 0x2018, 0x2019,
    0x00b0, 0x00d7, 0x00f7, 0x00b1,
    0x2192, 0x2190, 0x2191, 0x2193
  ])
  return extras.has(o)
}

function ord (ch) { return ch.codePointAt(0) }

function collectText () {
  const chunks = []
  function walk (dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skipDir.has(entry.name)) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (textExt.has(path.extname(entry.name).toLowerCase())) {
        if (full.includes(`${path.sep}public${path.sep}fonts${path.sep}`)) continue
        chunks.push(fs.readFileSync(full, 'utf8'))
      }
    }
  }
  walk(root)
  // branding is authoritative for tagline / name
  chunks.push(JSON.stringify(branding))
  return chunks.join('\n')
}

function collectCharset (text) {
  const set = new Set()
  for (const ch of text) {
    if (isUsefulChar(ch)) set.add(ch)
  }
  // Always keep a small Latin set for mixed UI measuring / OG fallbacks in the SC faces
  for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789·-–—…') set.add(ch)
  return [...set].sort((a, b) => ord(a) - ord(b)).join('')
}

async function ensureSource (name, url) {
  fs.mkdirSync(sourceDir, { recursive: true })
  const dest = path.join(sourceDir, name)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 100000) return dest
  // Prefer pre-seeded copy outside the repo (local cache)
  const seeded = path.join('/tmp/font-src', name)
  if (fs.existsSync(seeded)) {
    fs.copyFileSync(seeded, dest)
    return dest
  }
  console.log(`downloading ${name}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download ${name} failed: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
  return dest
}

function glyphsInFont (fontPath, text) {
  const font = fontkit.openSync(fontPath)
  const missing = []
  for (const ch of text) {
    const cp = ord(ch)
    if (!font.hasGlyphForCodePoint(cp)) missing.push(ch)
  }
  return missing
}

async function subsetOne (item, text) {
  const srcPath = await ensureSource(item.source, SOURCE[item.source].url)
  const missingInSource = glyphsInFont(srcPath, text)
  if (missingInSource.length) {
    throw new Error(`${item.source} missing source glyphs: ${missingInSource.join('')}`)
  }
  const input = fs.readFileSync(srcPath)
  const woff2 = await subsetFont(input, text, { targetFormat: 'woff2' })
  const ttf = await subsetFont(input, text, { targetFormat: 'sfnt' })
  const woff2Name = `${item.base}-v${fontVersion}.woff2`
  const ttfName = `${item.base}-v${fontVersion}.ttf`
  // also write stable names expected by generate-brand-assets
  const stableWoff2 = `${item.base}.woff2`
  const stableTtf = `${item.base}.ttf`
  fs.mkdirSync(publicFonts, { recursive: true })
  fs.writeFileSync(path.join(publicFonts, woff2Name), woff2)
  fs.writeFileSync(path.join(publicFonts, ttfName), ttf)
  fs.writeFileSync(path.join(publicFonts, stableWoff2), woff2)
  fs.writeFileSync(path.join(publicFonts, stableTtf), ttf)
  // verify subset
  const missing = glyphsInFont(path.join(publicFonts, ttfName), text)
  if (missing.length) {
    throw new Error(`${ttfName} subset missing: ${missing.join('')}`)
  }
  return {
    ...item,
    woff2Name,
    ttfName,
    bytes: { woff2: woff2.length, ttf: ttf.length }
  }
}

function writeFaces (outputs) {
  const lines = ['/* generated by scripts/generate-font-subset.mjs — do not edit */', '']
  for (const item of outputs) {
    lines.push('@font-face {')
    lines.push(`  font-family: "${item.family}";`)
    lines.push(`  src: url("/fonts/${item.woff2Name}") format("woff2");`)
    lines.push(`  font-weight: ${item.weight};`)
    lines.push('  font-style: normal;')
    lines.push('  font-display: swap;')
    lines.push('}')
    lines.push('')
  }
  // keep JetBrains Mono declaration here so all faces live in one generated file
  lines.push('@font-face {')
  lines.push('  font-family: "JetBrains Mono";')
  lines.push(`  src: url("/fonts/jetbrains-mono-400.woff2?v=${fontVersion}") format("woff2");`)
  lines.push('  font-weight: 400;')
  lines.push('  font-style: normal;')
  lines.push('  font-display: swap;')
  lines.push('}')
  lines.push('')
  const out = path.join(root, 'src/font-faces.generated.css')
  fs.writeFileSync(out, lines.join('\n'))
  return out
}

function writeManifest (text, outputs) {
  const hans = [...text].filter(ch => ord(ch) >= 0x4e00 && ord(ch) <= 0x9fff)
  const manifest = {
    generator: 'scripts/generate-font-subset.mjs',
    fontVersion,
    charCount: text.length,
    hanCount: hans.length,
    chars: text,
    outputs: outputs.map(o => ({
      family: o.family,
      weight: o.weight,
      woff2: o.woff2Name,
      ttf: o.ttfName,
      bytes: o.bytes
    }))
  }
  fs.writeFileSync(path.join(publicFonts, 'subset-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  return manifest
}

const text = collectCharset(collectText())
console.log(`charset: ${text.length} chars (${[...text].filter(c => /[\u4e00-\u9fff]/.test(c)).length} Han)`)
const outputs = []
for (const item of OUTPUTS) {
  const one = await subsetOne(item, text)
  outputs.push(one)
  console.log(`wrote ${one.woff2Name} (${one.bytes.woff2} bytes)`)
}
writeFaces(outputs)
const manifest = writeManifest(text, outputs)
console.log(`font subset v${fontVersion} ready; Han=${manifest.hanCount}`)
