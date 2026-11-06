import { useEffect, useState } from 'react'

const DELAY = { slow: 1100, mid: 640, fast: 280 }

export function usePlayback (frames) {
  const [run, setRun] = useState({ frames, index: -1, playing: false })
  const [speed, setSpeed] = useState('mid')

  if (run.frames !== frames) {
    setRun({ frames, index: -1, playing: false })
  }

  const live = run.frames === frames
  const index = live ? run.index : -1
  const playing = live ? run.playing : false
  const length = frames.length
  const done = length > 0 && index >= length - 1

  useEffect(() => {
    if (!playing) return undefined
    if (length === 0) {
      setRun(current => ({ ...current, playing: false }))
      return undefined
    }
    if (index < 0) {
      setRun(current => ({ ...current, index: 0 }))
      return undefined
    }
    if (index >= length - 1) {
      setRun(current => ({ ...current, playing: false }))
      return undefined
    }
    const delay = DELAY[speed] || DELAY.mid
    const id = window.setTimeout(() => {
      setRun(current => {
        if (current.frames !== frames || !current.playing) return current
        return { ...current, index: Math.min(length - 1, current.index + 1) }
      })
    }, delay)
    return () => window.clearTimeout(id)
  }, [playing, index, speed, length, frames])

  function toggle () {
    if (length === 0 || done) return
    setRun(current => ({ ...current, frames, playing: !current.playing }))
  }

  function step () {
    if (length === 0 || done) return
    setRun(current => ({
      ...current,
      frames,
      playing: false,
      index: Math.min(length - 1, current.index + 1)
    }))
  }

  function reset () {
    setRun({ frames, index: -1, playing: false })
  }

  return {
    index,
    frame: index >= 0 ? frames[index] : null,
    playing,
    done,
    speed,
    setSpeed,
    toggle,
    step,
    reset,
    stepCount: index < 0 ? 0 : index + 1,
    total: length
  }
}
