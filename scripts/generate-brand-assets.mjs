import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Resvg } from '@resvg/resvg-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const branding = JSON.parse(fs.readFileSync(path.join(root, 'src/branding.json'), 'utf8'))
const publicDir = path.join(root, 'public')
const marksDir = path.join(root, 'scripts/brand-marks')
const fontDir = path.join(publicDir, 'fonts')

const lacquer = branding.palette.lacquer
const bone = branding.palette.bone
const cinnabar = branding.palette.cinnabar
const inkSoft = '#E4D5C6'

function fonts () {
  return {
    fontFiles: [
      path.join(fontDir, 'noto-serif-sc-600.ttf'),
      path.join(fontDir, 'noto-sans-sc-400.ttf'),
      path.join(fontDir, 'noto-sans-sc-600.ttf')
    ],
    loadSystemFonts: false,
    defaultFontFamily: 'Noto Sans SC'
  }
}

function raster (svg, width) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: fonts() })
  return resvg.render().asPng()
}

function xml (value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function readMark (name) {
  return fs.readFileSync(path.join(marksDir, name), 'utf8')
}

function cells () {
  const parts = []
  for (let i = 0; i < 9; i++) {
    const x = i * 46
    const fill = i === 4 ? cinnabar : bone
    parts.push(`<rect x="${x}" y="0" width="36" height="36" rx="2" fill="${fill}"/>`)
  }
  const spanX = 2 * 46
  const spanW = 5 * 36 + 4 * 10
  parts.push(`<rect x="${spanX}" y="48" width="${spanW}" height="4" rx="2" fill="${cinnabar}"/>`)
  parts.push(`<rect x="${spanX}" y="42" width="3" height="16" fill="${cinnabar}"/>`)
  parts.push(`<rect x="${spanX + spanW - 3}" y="42" width="3" height="16" fill="${cinnabar}"/>`)
  return parts.join('')
}

function ogSvg () {
  const host = branding.siteUrl.replace(/^https?:\/\//, '')
  // Lettermark-style name: split on middle dot so the cinnabar · is drawn separately
  const parts = String(branding.name).split('·')
  const left = parts[0] || branding.name
  const right = parts[1] || ''
  // Approximate mono lettermark with Noto Sans SC (generator fonts); spacing tuned for algo·pace
  const leftX = 80
  const leftSize = 72
  // rough advance for "algo" at 72px ~ 4 * 0.62em
  const leftW = left.length * leftSize * 0.62
  const dotX = leftX + leftW + 8
  const rightX = dotX + 28
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${lacquer}"/>
  <text x="${leftX}" y="230" font-family="Noto Sans SC" font-size="${leftSize}" font-weight="600" fill="${bone}">${xml(left)}</text>
  <circle cx="${dotX + 10}" cy="204" r="10" fill="${cinnabar}"/>
  <text x="${rightX}" y="230" font-family="Noto Sans SC" font-size="${leftSize}" font-weight="600" fill="${bone}">${xml(right)}</text>
  <text x="80" y="310" font-family="Noto Sans SC" font-size="36" fill="${bone}">${xml(branding.tagline)}</text>
  <text x="80" y="362" font-family="Noto Sans SC" font-size="28" fill="${inkSoft}">${xml(branding.taglineEn)}</text>
  <g transform="translate(80 410)">${cells()}</g>
  <text x="80" y="560" font-family="Noto Sans SC" font-size="22" fill="${inkSoft}">${xml(host)}</text>
</svg>`
}

function writeIco (images) {
  const count = images.length
  const header = 6 + count * 16
  let offset = header
  const entries = []
  for (const image of images) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 0)
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(image.png.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    offset += image.png.length
  }
  const head = Buffer.alloc(6)
  head.writeUInt16LE(0, 0)
  head.writeUInt16LE(1, 2)
  head.writeUInt16LE(count, 4)
  return Buffer.concat([head, ...entries, ...images.map(image => image.png)])
}

const icon32 = readMark('favicon-32.svg')
const icon180 = readMark('favicon-180.svg')
const png16 = raster(icon32, 16)
const png32 = raster(icon32, 32)
const apple = raster(icon180, 180)
const og = raster(ogSvg(), 1200)

fs.mkdirSync(publicDir, { recursive: true })
// Public SVG favicon: same approved mark, so /favicon.svg never falls through to HTML
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), icon32)
fs.writeFileSync(path.join(publicDir, 'favicon-16.png'), png16)
fs.writeFileSync(path.join(publicDir, 'favicon-32.png'), png32)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), apple)
fs.writeFileSync(path.join(publicDir, 'og.png'), og)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), writeIco([
  { size: 16, png: png16 },
  { size: 32, png: png32 }
]))

const provenance = {
  generator: 'scripts/generate-brand-assets.mjs',
  reads: ['src/branding.json', 'scripts/brand-marks/favicon-32.svg', 'scripts/brand-marks/favicon-180.svg'],
  note: 'Lettermark favicon is a + cinnabar dot (algo·pace). OG is generated from branding.json.',
  name: branding.name,
  tagline: branding.tagline,
  taglineEn: branding.taglineEn,
  iconVersion: branding.iconVersion
}
fs.writeFileSync(path.join(publicDir, 'og.png.json'), JSON.stringify(provenance, null, 2) + '\n')
console.log('wrote favicon.svg/ico/png, apple-touch-icon, and og.png from branding + brand-marks')
