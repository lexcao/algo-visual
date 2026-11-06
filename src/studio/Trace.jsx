import React from 'react'

export function ValueLine ({ values, hot = [], quietFrom = values.length, quietBefore = 0 }) {
  return (
    <p className="value-line" aria-hidden="true">
      {values.map((value, index) => {
        const hotIndex = hot.indexOf(index) !== -1
        const quiet = index < quietBefore || index >= quietFrom
        const className = hotIndex ? 'is-hot' : quiet ? 'is-quiet' : undefined
        return <span key={index} className={className}>{value}</span>
      })}
    </p>
  )
}

export default function Trace ({ frames, index, describe, picture }) {
  const shown = index < 0 ? [] : frames.slice(0, index + 1)
  return (
    <section className="trace" aria-labelledby="trace-heading">
      <h2 id="trace-heading" className="section-title">步骤记录 <span lang="en">Trace</span></h2>
      {shown.length === 0 ? (
        <>
          <p className="trace-empty">还没有步骤。按播放或单步开始。</p>
          <p className="trace-empty trace-en" lang="en">No steps yet. Press play or step.</p>
        </>
      ) : (
        <ol className="trace-list">
          {shown.map((frame, step) => {
            const sentence = describe(frame)
            return (
              <li key={step}>
                <span className="trace-n">{step + 1}</span>
                <div className="trace-body">
                  <p>{sentence.zh}</p>
                  <p className="trace-en" lang="en">{sentence.en}</p>
                  {picture ? picture(frame) : null}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
