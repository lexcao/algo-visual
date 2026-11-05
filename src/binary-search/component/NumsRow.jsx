import React, { useLayoutEffect, useRef, useState } from 'react'

const MARKS = {
  low: '低',
  mid: '中',
  high: '高'
}

export default function NumsRow ({
  nums,
  l,
  h,
  m,
  t,
  running,
  readonly = false,
  compact = false,
  onSelect
}) {
  const n = nums.length
  const ranged = l >= 0 && h >= l && h < n
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
      const cells = track.querySelectorAll('.cell')
      const start = cells[l]
      const end = cells[h]
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
  }, [ranged, l, h, n, compact, nums])

  return (
    <div className={compact ? 'row row-compact' : 'row'}>
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
          role={readonly ? undefined : 'group'}
          aria-label={readonly ? undefined : '数组，点击一个数把它设为目标'}
          aria-hidden={readonly ? true : undefined}
        >
          {ranged && box && <div className="span" aria-hidden="true"/>}
          {nums.map((value, index) => {
            const out = ranged && (index < l || index > h)
            const isMid = m >= 0 && index === m && (!ranged || (m >= l && m <= h))
            const isLow = ranged && index === l
            const isHigh = ranged && index === h
            const isTarget = t >= 0 && value === t
            const marks = []
            if (isLow) marks.push('low')
            if (isMid) marks.push('mid')
            if (isHigh) marks.push('high')
            const className = [
              'cell',
              out ? 'is-out' : '',
              isMid ? 'is-mid' : '',
              isTarget ? 'is-target' : ''
            ].filter(Boolean).join(' ')

            const label = `下标 ${index}，值 ${value}${out ? '，已排除' : ''}${isMid ? '，中点' : ''}${isTarget ? '，目标' : ''}`

            return (
              <div className="cell-wrap" key={index}>
                {readonly ? (
                  <div className={className}>{value}</div>
                ) : (
                  <button
                    type="button"
                    className={className}
                    disabled={running}
                    aria-pressed={isTarget}
                    aria-label={label}
                    onClick={() => onSelect && onSelect(index)}
                  >
                    {value}
                  </button>
                )}
                <div className="marks">
                  {marks.map(mark => (
                    <span key={mark} className={`mark mark-${mark}`}>{MARKS[mark]}</span>
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
