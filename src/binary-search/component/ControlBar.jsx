import React from 'react'

export default function ControlBar ({
  target,
  l,
  h,
  m,
  stepCount,
  found,
  running,
  status,
  onReset,
  onNext
}) {
  const label = !running ? '开始' : found ? '已找到' : '下一步'
  const bounds = `l ${l < 0 ? '–' : l}   m ${m < 0 ? '–' : m}   h ${h < 0 ? '–' : h}`

  return (
    <section className="controls" aria-label="步进控制">
      <p className="status" role="status">{status.zh}</p>
      <p className="status-en" lang="en">{status.en}</p>
      <div className="controls-bar">
        <p className="tally">
          <span className="tally-k">步</span>
          <span className="tally-n">{stepCount}</span>
        </p>
        <p className="bounds">
          <span>{bounds}</span>
          <span className="bounds-target">目标 {target < 0 ? '未选' : target}</span>
        </p>
        <button type="button" className="btn btn-ghost" onClick={onReset}>重置</button>
        <button type="button" className="btn btn-primary" onClick={onNext} disabled={found}>
          {label}
        </button>
      </div>
      <p className="hint">键盘：→ 下一步，R 重置</p>
    </section>
  )
}
