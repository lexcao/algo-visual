import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import branding from '../branding.json'
import catalog from '../seo/catalog.json'

const algorithms = catalog.nav
const variants = catalog.routes.filter(route => route.family === 'binary-search' && route.id !== 'index')

export function normalizePath (pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.replace(/\/+$/, '')
  return pathname
}

function navCurrent (item, pathname) {
  const path = normalizePath(pathname)
  if (item.prefix) return path === item.prefix || path.startsWith(item.prefix + '/')
  return path === item.path
}

function applyMeta (route) {
  const title = route
    ? `${route.titleSuffix} · ${branding.name}`
    : `页面不存在 · ${branding.name}`
  const description = route ? route.summary : '这个地址没有对应的页面。'
  document.title = title
  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.setAttribute('content', description)
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical && route) canonical.setAttribute('href', branding.siteUrl + route.path)
}

export default function Shell ({ children }) {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)
  const route = catalog.routes.find(item => item.path === path) || null

  useEffect(() => {
    applyMeta(route)
  }, [route])

  return (
    <>
      <a className="skip" href="#work">跳到内容</a>
      <header className="top">
        <div className="top-inner">
          <Link className="brand" to="/binary-search">{branding.name}</Link>
          <nav className="nav" aria-label="算法">
            {algorithms.map(item => (
              <Link
                key={item.id}
                to={item.path}
                aria-current={navCurrent(item, path) ? 'page' : undefined}
              >
                <span>{item.labelZh}</span>
                <span className="nav-en" lang="en">{item.labelEn}</span>
              </Link>
            ))}
          </nav>
        </div>
        {path.startsWith('/binary-search') ? (
          <div className="top-sub">
            <div className="top-inner">
              <nav className="subnav" aria-label="变体">
                {variants.map(item => (
                  <Link
                    key={item.id}
                    to={item.path}
                    aria-current={path === item.path ? 'page' : undefined}
                  >
                    {item.labelZh}
                    <span className="nav-en" lang="en">{item.labelEn}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        ) : null}
      </header>
      <main id="work" className="work">
        {children}
      </main>
      <footer className="foot">
        <div className="foot-inner">
          <p>{branding.tagline}</p>
          <p lang="en">{branding.taglineEn}</p>
        </div>
      </footer>
    </>
  )
}

export function Missing () {
  return (
    <article className="missing">
      <h1>页面不存在 <span lang="en">Page not found</span></h1>
      <p>这个地址没有对应的算法页面。</p>
      <p lang="en">This address does not match an algorithm page.</p>
      <Link className="text-link" to="/binary-search">返回二分查找</Link>
    </article>
  )
}
