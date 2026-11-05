import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Resvg } from '@resvg/resvg-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const branding = JSON.parse(fs.readFileSync(path.join(root, 'src/branding.json'), 'utf8'))
const publicDir = path.join(root, 'public')
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
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${lacquer}"/>
  <text x="80" y="230" font-family="Noto Serif SC" font-size="78" font-weight="600" fill="${bone}">${xml(branding.name)}</text>
  <text x="80" y="310" font-family="Noto Sans SC" font-size="36" fill="${bone}">${xml(branding.tagline)}</text>
  <text x="80" y="362" font-family="Noto Sans SC" font-size="28" fill="${inkSoft}">${xml(branding.taglineEn)}</text>
  <g transform="translate(80 410)">${cells()}</g>
  <text x="80" y="560" font-family="Noto Sans SC" font-size="22" fill="${inkSoft}">${xml(host)}</text>
</svg>`
}

function iconSvg () {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="30" height="30" rx="7" fill="${lacquer}"/>
  <rect x="7" y="14.5" width="18" height="3" rx="1.5" fill="${bone}"/>
  <rect x="13.5" y="11" width="5" height="10" rx="1" fill="${cinnabar}"/>
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

const icon = iconSvg()
const png16 = raster(icon, 16)
const png32 = raster(icon, 32)
const apple = raster(icon, 180)
const og = raster(ogSvg(), 1200)

fs.mkdirSync(publicDir, { recursive: true })
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
  reads: 'src/branding.json',
  note: 'Neutral placeholder mark and OG template. Not a finished logo. Text is the configured name, tagline, and host.',
  name: branding.name,
  tagline: branding.tagline,
  taglineEn: branding.taglineEn
}
fs.writeFileSync(path.join(publicDir, 'og.png.json'), JSON.stringify(provenance, null, 2) + '\n')
console.log('wrote favicon, apple touch icon, and og.png from branding.json')
