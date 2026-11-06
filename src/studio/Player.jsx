import React, { useEffect } from 'react'

const SPEEDS = [
  { id: 'slow', label: '慢' },
  { id: 'mid', label: '中' },
  { id: 'fast', label: '快' }
]

export default function Player ({
  stepCount,
  playing,
  done,
  speed,
  status,
  detail,
  onToggle,
  onStep,
  onReset,
  onSpeed
}) {
  useEffect(() => {
    function onKey (event) {
      if (event.repeat) return
      const tag = event.target && event.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.target && event.target.closest && event.target.closest('.code, .nav, .subnav, .board')) return
      if (event.key === ' ' || event.code === 'Space') {
        if (tag === 'BUTTON') return
        event.preventDefault()
        onToggle()
      } else if (event.key === 'ArrowRight' && !event.altKey && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        onStep()
      } else if ((event.key === 'r' || event.key === 'R') && !event.metaKey && !event.ctrlKey && !event.altKey) {
        onReset()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const label = done ? '完成' : playing ? '暂停' : stepCount === 0 ? '播放' : '继续'

  return (
    <section className="controls" aria-label="播放控制">
      <p className="status" role="status">{status.zh}</p>
      <p className="status-en" lang="en">{status.en}</p>
      <div className="controls-bar">
        <p className="tally">
          <span className="tally-k">步</span>
          <span className="tally-n">{stepCount}</span>
        </p>
        <p className="bounds">
          <span>{detail}</span>
        </p>
        <div className="speed" role="group" aria-label="速度">
          {SPEEDS.map(item => (
            <button
              key={item.id}
              type="button"
              aria-pressed={speed === item.id}
              onClick={() => onSpeed(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-ghost" onClick={onReset}>重置</button>
        <button type="button" className="btn btn-ghost" onClick={onStep} disabled={done}>单步</button>
        <button type="button" className="btn btn-primary" onClick={onToggle} disabled={done}>
          {label}
        </button>
      </div>
      <p className="hint">键盘：空格 播放或暂停，→ 单步，R 重置</p>
      <p className="hint" lang="en">Space plays or pauses. Right arrow steps. R resets.</p>
    </section>
  )
}
