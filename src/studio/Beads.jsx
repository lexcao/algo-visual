import React, { useLayoutEffect, useRef, useState } from 'react'

function magnitude (values) {
  let min = 0
  let max = 0
  for (let i = 0; i < values.length; i++) {
    if (values[i] < min) min = values[i]
    if (values[i] > max) max = values[i]
  }
  const span = Math.max(max - min, 1)
  return { min, span }
}

export default function Beads ({ values, ids, hot = [], lo = -1, hi = -1, marks = {}, dim = false }) {
  const n = values.length
  const trackRef = useRef(null)
  const [box, setBox] = useState(null)
  const ranged = n > 0 && lo >= 0 && hi >= lo && hi < n
  const scale = magnitude(values)
  const indexById = new Map()
  for (let i = 0; i < ids.length; i++) indexById.set(ids[i], i)
  const order = ids.length === n ? ids.slice().sort((a, b) => a - b) : values.map((_, index) => index)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    function measure () {
      if (!ranged) {
        setBox(null)
        return
      }
      const start = track.querySelector(`.bead[data-index="${lo}"]`)
      const end = track.querySelector(`.bead[data-index="${hi}"]`)
      const startVal = track.querySelector(`.bead-val[data-index="${lo}"]`)
      if (!start || !end || !startVal) return
      const host = track.getBoundingClientRect()
      const a = start.getBoundingClientRect()
      const b = end.getBoundingClientRect()
      const value = startVal.getBoundingClientRect()
      setBox({
        left: a.left - host.left,
        width: Math.max(0, b.right - a.left),
        top: value.bottom - host.top + 8
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
  }, [ranged, lo, hi, n, ids, values])

  const hotText = hot.length
    ? `，正在看下标 ${hot.join(' 和 ')}`
    : ''
  const label = `序列 ${values.join(' ')}${hotText}`

  return (
    <figure className="beads-fig">
      <div
        className="beads-track"
        ref={trackRef}
        style={box ? {
          '--n': n,
          '--span-left': `${box.left}px`,
          '--span-width': `${box.width}px`,
          '--span-top': `${box.top}px`
        } : { '--n': n }}
        role="img"
        aria-label={label}
      >
        {ranged && box ? <div className="span" aria-hidden="true"/> : null}
        {order.map(id => {
          const index = indexById.has(id) ? indexById.get(id) : id
          const value = values[index]
          const height = value === 0
            ? 3
            : Math.max(10, Math.round(Math.abs(value) / scale.span * 128))
          const isHot = hot.indexOf(index) !== -1
          const out = dim || (ranged && (index < lo || index > hi))
          const mark = marks[index] || []
          const className = [
            'bead-bar',
            isHot ? 'is-hot' : '',
            out ? 'is-out' : ''
          ].filter(Boolean).join(' ')
          return (
            <div key={id} className="bead" data-index={index} style={{ '--i': index }}>
              <div className="bead-plot">
                <div className={className} style={{ '--h': height }}/>
              </div>
              <div className={out ? 'bead-val is-out' : 'bead-val'} data-index={index}>{value}</div>
              <div className="marks">
                {mark.map(item => (
                  <span key={item} className={item === '枢' ? 'mark mark-mid' : 'mark'}>{item}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </figure>
  )
}
