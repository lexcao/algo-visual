import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const branding = JSON.parse(fs.readFileSync(path.join(root, 'src/branding.json'), 'utf8'))
export const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/seo/catalog.json'), 'utf8'))

const NUM_FILES = {
  'sorted-array': 'src/binary-search/data/BinarySearch.js',
  'sorted-array-with-duplicate': 'src/binary-search/data/BinarySearchDuplicate.js',
  'rotated-sorted-array': 'src/binary-search/data/BinarySearchRotate.js',
  'rotated-sorted-array-with-duplicate': 'src/binary-search/data/BinarySearchRotateDuplicate.js'
}

export function readNums (id) {
  const file = NUM_FILES[id]
  if (!file) return null
  const source = fs.readFileSync(path.join(root, file), 'utf8')
  const match = source.match(/const nums = (\[[\d,\s]+\])/)
  if (!match) throw new Error(`Could not read nums from ${file}`)
  return JSON.parse(match[1])
}

export function pageTitle (route) {
  return `${route.titleSuffix} · ${branding.name}`
}

export function canonical (route) {
  return branding.siteUrl + route.path
}

export function esc (value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function jsonLd (route) {
  const url = canonical(route)
  const home = branding.siteUrl + '/binary-search'
  const graph = [
    {
      '@type': 'WebApplication',
      name: branding.name,
      url: home,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      browserRequirements: 'JavaScript is required for the step-through. The introduction is readable without it.',
      inLanguage: ['zh-CN', 'en'],
      isAccessibleForFree: true,
      description: `${branding.tagline} ${branding.taglineEn}`
    },
    {
      '@type': 'WebPage',
      name: pageTitle(route),
      url,
      description: route.summary,
      inLanguage: 'zh-CN',
      isPartOf: { '@type': 'WebSite', name: branding.name, url: home }
    }
  ]

  if (route.id === 'index') {
    graph.splice(1, 0, {
      '@type': 'WebSite',
      name: branding.name,
      url: home,
      inLanguage: ['zh-CN', 'en'],
      description: route.summary
    })
  } else if (route.id !== 'missing') {
    graph.splice(1, 0, {
      '@type': 'LearningResource',
      name: route.titleSuffix,
      url,
      description: route.summary,
      inLanguage: ['zh-CN', 'en'],
      learningResourceType: 'interactive visualization',
      teaches: route.teaches || 'Binary search',
      isAccessibleForFree: true,
      isPartOf: home
    })
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}

export function headBlock (route, { robots = 'index,follow', canonicalLink = true } = {}) {
  const title = pageTitle(route)
  const image = `${branding.siteUrl}${branding.icons.og}?v=${branding.iconVersion}`
  const imageAlt = `${branding.name}：${branding.tagline}`
  const url = canonical(route)
  const v = branding.iconVersion
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(route.summary)}"/>`,
    canonicalLink ? `<link rel="canonical" href="${esc(url)}"/>` : '',
    `<meta name="robots" content="${robots}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:site_name" content="${esc(branding.name)}"/>`,
    `<meta property="og:locale" content="zh_CN"/>`,
    `<meta property="og:locale:alternate" content="en_US"/>`,
    `<meta property="og:title" content="${esc(title)}"/>`,
    `<meta property="og:description" content="${esc(route.summary)}"/>`,
    `<meta property="og:url" content="${esc(url)}"/>`,
    `<meta property="og:image" content="${esc(image)}"/>`,
    `<meta property="og:image:width" content="1200"/>`,
    `<meta property="og:image:height" content="630"/>`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${esc(title)}"/>`,
    `<meta name="twitter:description" content="${esc(route.summary)}"/>`,
    `<meta name="twitter:image" content="${esc(image)}"/>`,
    `<link rel="icon" href="${branding.icons.favicon}?v=${v}" sizes="any"/>`,
    `<link rel="icon" type="image/png" href="${branding.icons.png32}?v=${v}" sizes="32x32"/>`,
    `<link rel="icon" type="image/png" href="${branding.icons.png16}?v=${v}" sizes="16x16"/>`,
    `<link rel="apple-touch-icon" href="${branding.icons.apple}?v=${v}"/>`,
    `<script type="application/ld+json">${jsonLd(route)}</script>`
  ].join('\n    ')
}

export function introBlock (route) {
  const variants = catalog.routes.filter(item => item.id !== 'index')
  const links = variants.map(item => {
    const nums = readNums(item.id)
    const preview = nums ? `：${nums.join(' ')}` : item.preview ? `：${item.preview}` : ''
    return `            <li><a href="${item.path}">${esc(item.labelZh)} <span lang="en">${esc(item.labelEn)}</span>${esc(preview)}</a></li>`
  }).join('\n')
  const ownNums = readNums(route.id)
  const sample = ownNums
    ? `\n    <p>示例数组：${esc(ownNums.join(' '))}</p>`
    : ''
  return `<article id="static-intro">
    <p class="static-brand"><a href="/binary-search">${esc(branding.name)}</a></p>
    <h1>${esc(route.labelZh)} <span lang="en">${esc(route.labelEn)}</span></h1>
    <p>${esc(route.introZh)}</p>
    <p lang="en">${esc(route.introEn)}</p>${sample}
    <nav aria-label="算法">
        <ul>
${links}
        </ul>
    </nav>
    <p class="static-note">逐步动画需要 JavaScript。上面的链接不需要。</p>
    <p class="static-note" lang="en">The step-through needs JavaScript. The links above do not.</p>
</article>`
}

export function notFoundRoute () {
  return {
    id: 'missing',
    path: '/404',
    titleSuffix: '页面不存在',
    labelZh: '页面不存在',
    labelEn: 'Page not found',
    summary: '这个地址没有对应的算法页面。',
    introZh: '这个地址没有对应的算法页面。',
    introEn: 'This address does not match an algorithm page.'
  }
}

export function robotsTxt () {
  return `User-agent: *\nAllow: /\n\nSitemap: ${branding.siteUrl}/sitemap.xml\n`
}

export function sitemapXml () {
  const urls = catalog.routes.map(route => `  <url><loc>${canonical(route)}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function applyTemplate (html, route, options) {
  let next = html.replace(
    /<!--seo:head-->[\s\S]*?<!--\/seo:head-->/,
    `<!--seo:head-->\n    ${headBlock(route, options)}\n    <!--/seo:head-->`
  )
  next = next.replace(
    /<!--seo:intro-->[\s\S]*?<!--\/seo:intro-->/,
    `<!--seo:intro-->\n${introBlock(route)}\n<!--/seo:intro-->`
  )
  if (next === html) throw new Error('SEO markers missing from built HTML')
  return next
}
