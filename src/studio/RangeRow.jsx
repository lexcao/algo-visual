import React, { useLayoutEffect, useRef, useState } from 'react'

export default function RangeRow ({
  values,
  lo,
  hi,
  hot = [],
  marks = {},
  label
}) {
  const n = values.length
  const ranged = n > 0 && lo >= 0 && hi >= lo && hi < n
  const trackRef = useRef(null)
  const [box, setBox] = useState(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    function measure () {
      if (!ranged) {
        setBox(null)
        return
      }
      const start = track.querySelector(`[data-index="${lo}"]`)
      const end = track.querySelector(`[data-index="${hi}"]`)
      if (!start || !end) return
      const host = track.getBoundingClientRect()
      const a = start.getBoundingClientRect()
      const b = end.getBoundingClientRect()
      setBox({
        left: a.left - host.left,
        width: Math.max(0, b.right - a.left),
        top: a.bottom - host.top + 8
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [ranged, lo, hi, n, values])

  return (
    <div className="row">
      <div className="row-scroll">
        <div
          className="row-track"
          ref={trackRef}
          style={box ? {
            '--n': n,
            '--span-left': `${box.left}px`,
            '--span-width': `${box.width}px`,
            '--span-top': `${box.top}px`
          } : { '--n': n }}
          role="img"
          aria-label={label || `序列 ${values.join(' ')}`}
        >
          {ranged && box ? <div className="span" aria-hidden="true"/> : null}
          {values.map((value, index) => {
            const out = ranged && (index < lo || index > hi)
            const isHot = hot.indexOf(index) !== -1
            const mark = marks[index] || []
            const className = [
              'cell',
              out ? 'is-out' : '',
              isHot ? 'is-mid' : ''
            ].filter(Boolean).join(' ')
            return (
              <div className="cell-wrap" key={index}>
                <div className={className} data-index={index}>{value}</div>
                <div className="marks">
                  {mark.map(item => (
                    <span key={item} className={item === '最优' ? 'mark mark-mid' : 'mark'}>{item}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
