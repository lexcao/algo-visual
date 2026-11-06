import React from 'react'

export function Complexity ({ route }) {
  return (
    <section className="complexity" aria-label="复杂度">
      <p className="facts-note">{route.complexityZh}</p>
      <p className="facts-note" lang="en">{route.complexityEn}</p>
    </section>
  )
}

export default function Study ({ route, children }) {
  return (
    <article>
      <h1>
        <span className="h1-zh">{route.labelZh}</span>
        <span className="h1-en" lang="en">{route.labelEn}</span>
      </h1>
      <p className="lede">{route.introZh}</p>
      <p className="lede-en" lang="en">{route.introEn}</p>
      <p className="facts">
        <span>时间 <strong>{route.time}</strong></span>
        <span>空间 <strong>{route.space}</strong></span>
      </p>
      {children}
    </article>
  )
}
