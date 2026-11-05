import React from 'react'
import { Link } from 'react-router-dom'
import catalog from '../seo/catalog.json'
import data from './data/index'
import NumsRow from './component/NumsRow'

const indexRoute = catalog.routes.find(route => route.id === 'index')
const variants = catalog.routes.filter(route => route.id !== 'index')

export default function IndexPage () {
  const sample = data[0]
  return (
    <article>
      <h1>
        <span className="h1-zh">{indexRoute.labelZh}</span>
        <span className="h1-en" lang="en">{indexRoute.labelEn}</span>
      </h1>
      <p className="lede">{indexRoute.introZh}</p>
      <p className="lede-en" lang="en">{indexRoute.introEn}</p>

      <figure className="notation">
        <NumsRow nums={sample.nums} l={0} h={sample.nums.length - 1} m={4} t={7} readonly/>
      </figure>
      <p className="status">中点是 4，比目标 7 小。下一步丢掉左半。</p>
      <p className="status-en" lang="en">The midpoint is 4, below target 7. The next step discards the left half.</p>
      <div className="controls-bar">
        <Link className="btn btn-primary" to="/binary-search/sorted-array">开始</Link>
      </div>

      <h2 className="section-title" id="variants">四个变体 <span lang="en">Four variants</span></h2>
      <ul className="variant-index">
        {variants.map(route => {
          const variant = data.find(item => item.id === route.id)
          return (
            <li key={route.id}>
              <Link to={route.path}>
                <span className="v-name">
                  <span className="v-zh">{route.labelZh}</span>
                  <span className="v-en" lang="en">{route.labelEn}</span>
                </span>
                <span className="seq">{variant.nums.join(' ')}</span>
                <svg className="go" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
