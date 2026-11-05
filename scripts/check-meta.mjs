import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  branding,
  canonical,
  catalog,
  esc,
  pageTitle,
  robotsTxt,
  sitemapXml
} from './seo-data.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const failures = []

function fail (message) {
  failures.push(message)
}

function read (file) {
  const full = path.join(dist, file)
  if (!fs.existsSync(full)) {
    fail(`missing ${file}`)
    return ''
  }
  return fs.readFileSync(full, 'utf8')
}

function expectRoute (file, route) {
  const html = read(file)
  if (!html) return
  const title = pageTitle(route)
  if (!html.includes('<html lang="zh-CN"') && !html.includes("<html lang=\"zh-CN\"")) {
    fail(`${file} lang is not zh-CN`)
  }
  if (!html.includes(`<title>${esc(title)}</title>`)) fail(`${file} title`)
  if (!html.includes(`content="${esc(route.summary)}"`)) fail(`${file} description`)
  if (!html.includes(`rel="canonical" href="${esc(canonical(route))}"`)) fail(`${file} canonical`)
  if (!html.includes('name="theme-color"')) fail(`${file} theme-color`)
  if (!html.includes(`content="${branding.themeColor}"`)) fail(`${file} theme-color value`)
  if (!html.includes('property="og:title"')) fail(`${file} og:title`)
  if (!html.includes('property="og:description"')) fail(`${file} og:description`)
  if (!html.includes('property="og:image"')) fail(`${file} og:image`)
  if (!html.includes(`property="og:site_name" content="${esc(branding.name)}"`)) fail(`${file} og:site_name`)
  if (!html.includes('rel="icon"')) fail(`${file} favicon link`)
  if (!html.includes('application/ld+json') || !html.includes('"@type":"WebApplication"') && !html.includes('"@type": "WebApplication"')) {
    fail(`${file} WebApplication JSON-LD`)
  }
  if (route.id === 'index' && !html.includes('"@type":"WebSite"') && !html.includes('"@type": "WebSite"')) {
    fail(`${file} WebSite JSON-LD`)
  }
  if (route.id !== 'index' && !html.includes('LearningResource')) fail(`${file} LearningResource JSON-LD`)
  if (!html.includes(route.introZh) || !html.includes(route.introEn)) fail(`${file} bilingual intro`)
  for (const item of catalog.routes) {
    if (item.id === 'index') continue
    if (!html.includes(`href="${item.path}"`)) fail(`${file} missing link ${item.path}`)
  }
  if (!html.includes('id="static-intro"')) fail(`${file} static intro`)
  if (!html.includes('id="root"')) fail(`${file} root mount`)
}

const index = catalog.routes.find(route => route.id === 'index')
expectRoute('index.html', index)
expectRoute('binary-search/index.html', index)
for (const route of catalog.routes) {
  if (route.id === 'index') continue
  expectRoute(`${route.path.replace(/^\//, '')}/index.html`, route)
}

const notFound = read('404.html')
if (notFound) {
  if (!notFound.includes('noindex')) fail('404.html is indexable')
  if (!notFound.includes('页面不存在')) fail('404.html copy')
  if (!notFound.includes('Page not found')) fail('404.html english')
  if (notFound.includes('rel="canonical" href="https://algo.lexcao.io/404"')) fail('404.html should not canonicalize itself')
}

const robots = read('robots.txt')
if (robots) {
  if (/<html/i.test(robots)) fail('robots.txt is HTML')
  if (robots !== robotsTxt()) fail('robots.txt does not match branding')
}

const sitemap = read('sitemap.xml')
if (sitemap) {
  if (/<html/i.test(sitemap)) fail('sitemap.xml is HTML')
  if (sitemap !== sitemapXml()) fail('sitemap.xml does not list the routes from branding')
  for (const route of catalog.routes) {
    if (!sitemap.includes(`<loc>${canonical(route)}</loc>`)) fail(`sitemap missing ${route.path}`)
  }
  if (sitemap.includes('<loc>' + branding.siteUrl + '/</loc>') || sitemap.includes('<loc>' + branding.siteUrl + '</loc>')) {
    fail('sitemap should not list the redirecting root')
  }
}

function isPng (file) {
  const buf = fs.readFileSync(path.join(dist, file))
  return buf.length > 32 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
}

for (const file of ['favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png', 'og.png']) {
  if (!fs.existsSync(path.join(dist, file))) fail(`missing ${file}`)
  else if (!isPng(file)) fail(`${file} is not a PNG`)
}

const ico = path.join(dist, 'favicon.ico')
if (!fs.existsSync(ico)) fail('missing favicon.ico')
else {
  const buf = fs.readFileSync(ico)
  if (buf.length < 22 || buf[0] !== 0 || buf[1] !== 0 || buf[2] !== 1 || buf[3] !== 0) fail('favicon.ico is not an ICO')
  if (buf.includes(Buffer.from('<html'))) fail('favicon.ico is HTML')
}

function walk (dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.(js|jsx)$/.test(entry.name)) {
      const text = fs.readFileSync(full, 'utf8')
      if (/console\.log\(/.test(text)) fail(`console.log in ${path.relative(root, full)}`)
    }
  }
}
walk(path.join(root, 'src'))

if (failures.length) {
  console.error(failures.map(item => `- ${item}`).join('\n'))
  process.exit(1)
}

console.log(`meta check passed for ${catalog.routes.length} routes`)
