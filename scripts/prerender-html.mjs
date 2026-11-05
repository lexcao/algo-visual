import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  applyTemplate,
  catalog,
  notFoundRoute,
  robotsTxt,
  sitemapXml
} from './seo-data.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

function writeRoute (route, options) {
  const html = applyTemplate(shell, route, options)
  const directory = route.path === '/binary-search'
    ? path.join(dist, 'binary-search')
    : path.join(dist, route.path.replace(/^\//, ''))
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'index.html'), html)
  return html
}

const index = catalog.routes.find(route => route.id === 'index')
const indexHtml = applyTemplate(shell, index)
fs.writeFileSync(path.join(dist, 'index.html'), indexHtml)
writeRoute(index)

for (const route of catalog.routes) {
  if (route.id === 'index') continue
  writeRoute(route)
}

const missing = notFoundRoute()
const notFoundHtml = applyTemplate(shell, missing, { robots: 'noindex, nofollow', canonicalLink: false })
fs.writeFileSync(path.join(dist, '404.html'), notFoundHtml)

const robots = robotsTxt()
const sitemap = sitemapXml()
fs.writeFileSync(path.join(dist, 'robots.txt'), robots)
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(root, 'public/robots.txt'), robots)
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap)

console.log(`prerendered ${catalog.routes.length} routes, 404, robots.txt, sitemap.xml`)
