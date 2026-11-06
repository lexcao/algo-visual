import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const fontkit = require('fontkit')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const branding = JSON.parse(fs.readFileSync(path.join(root, 'src/branding.json'), 'utf8'))
const fontVersion = String(branding.fontVersion || '1')
const publicFonts = path.join(root, 'public/fonts')
const manifestPath = path.join(publicFonts, 'subset-manifest.json')

const failures = []
function fail (msg) { failures.push(msg) }

if (!fs.existsSync(manifestPath)) fail('missing public/fonts/subset-manifest.json — run npm run fonts')
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : null

if (manifest && String(manifest.fontVersion) !== fontVersion) {
  fail(`subset-manifest fontVersion ${manifest.fontVersion} != branding.fontVersion ${fontVersion}`)
}

// Re-extract expected charset the same way as the generator (keep in sync)
const textExt = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.html', '.css', '.md', '.svg', '.txt'])
const skipDir = new Set(['node_modules', 'dist', '.git', '.venv', 'font-src', 'assets'])

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
  chunks.push(JSON.stringify(branding))
  return chunks.join('\n')
}

function collectCharset (text) {
  const set = new Set()
  for (const ch of text) if (isUsefulChar(ch)) set.add(ch)
  for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789·-–—…') set.add(ch)
  return [...set].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('')
}

const expected = collectCharset(collectText())
if (manifest && manifest.chars !== expected) {
  // Allow regenerating: fail so CI forces npm run fonts
  const a = new Set(manifest.chars)
  const b = new Set(expected)
  const onlyExpected = [...b].filter(c => !a.has(c))
  const onlyManifest = [...a].filter(c => !b.has(c))
  if (onlyExpected.length) fail(`subset stale; missing from fonts: ${onlyExpected.join('')}`)
  if (onlyManifest.length) fail(`subset stale; extra in fonts (regen): ${onlyManifest.slice(0, 40).join('')}${onlyManifest.length > 40 ? '…' : ''}`)
}

const faces = [
  { file: `noto-sans-sc-400-v${fontVersion}.ttf`, label: 'Noto Sans SC 400' },
  { file: `noto-sans-sc-600-v${fontVersion}.ttf`, label: 'Noto Sans SC 600' },
  { file: `noto-serif-sc-600-v${fontVersion}.ttf`, label: 'Noto Serif SC 600' }
]

for (const face of faces) {
  const full = path.join(publicFonts, face.file)
  if (!fs.existsSync(full)) {
    fail(`missing ${face.file}`)
    continue
  }
  const font = fontkit.openSync(full)
  const missing = []
  for (const ch of expected) {
    if (!font.hasGlyphForCodePoint(ch.codePointAt(0))) missing.push(ch)
  }
  if (missing.length) fail(`${face.label} missing glyphs: ${missing.join('')}`)
}

// faces css must reference versioned files
const facesCss = path.join(root, 'src/font-faces.generated.css')
if (!fs.existsSync(facesCss)) fail('missing src/font-faces.generated.css')
else {
  const css = fs.readFileSync(facesCss, 'utf8')
  for (const face of faces) {
    const woff2 = face.file.replace(/\.ttf$/, '.woff2')
    if (!css.includes(woff2)) fail(`font-faces.generated.css missing ${woff2}`)
  }
}

if (failures.length) {
  console.error('font glyph check failed:')
  for (const f of failures) console.error('-', f)
  process.exit(1)
}
console.log(`font glyph check passed (${expected.length} chars, v${fontVersion})`)
