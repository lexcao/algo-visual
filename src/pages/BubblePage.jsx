import React, { useMemo, useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import catalog from '../seo/catalog.json'
import {
  BUBBLE_CODE,
  bubbleInitial,
  bubbleSteps,
  describeBubble
} from '../algorithms/bubble'
import { formatError, lengthError, parseInts } from '../algorithms/parse'
import Beads from '../studio/Beads'
import Editor from '../studio/Editor'
import Player from '../studio/Player'
import Study, { Complexity } from '../studio/Study'
import Trace, { ValueLine } from '../studio/Trace'
import { usePlayback } from '../studio/usePlayback'

const route = catalog.routes.find(item => item.id === 'bubble-sort')
const DEFAULT = '5 1 4 2 8'
const BOUNDS = { min: 2, max: 10 }

function readSequence (text) {
  const parsed = parseInts(text)
  if (!parsed.ok) return parsed
  return lengthError(parsed.nums, BOUNDS.min, BOUNDS.max)
}

export default function BubblePage () {
  const [draft, setDraft] = useState(DEFAULT)
  const [applied, setApplied] = useState(DEFAULT)
  const [error, setError] = useState(null)
  const parsed = useMemo(() => readSequence(applied), [applied])
  const nums = parsed.ok ? parsed.nums : []
  const frames = useMemo(() => {
    const next = readSequence(applied)
    return next.ok ? bubbleSteps(next.nums) : []
  }, [applied])
  const play = usePlayback(frames)
  const view = play.frame || bubbleInitial(nums)
  const status = play.frame
    ? describeBubble(play.frame)
    : describeBubble(bubbleInitial(nums))

  function onApply (event) {
    event.preventDefault()
    const next = readSequence(draft)
    if (!next.ok) {
      setError(formatError(next, BOUNDS))
      return
    }
    setError(null)
    setApplied(next.nums.join(' '))
    setDraft(next.nums.join(' '))
  }

  const detail = view.phase === 'done' || view.hi < 0
    ? '整段已归位'
    : view.j >= 0
      ? `比较下标 ${view.j} 与 ${view.j + 1}`
      : `未排序 0–${view.hi}`

  return (
    <Study route={route}>
      <Editor
        label="序列"
        labelEn="Sequence"
        value={draft}
        onChange={setDraft}
        onSubmit={onApply}
        error={error}
      />
      <ul className="legend">
        <li><i className="swatch swatch-low" aria-hidden="true"/>未排序 <span lang="en">unsorted</span></li>
        <li><i className="swatch swatch-mid" aria-hidden="true"/>正在比较 <span lang="en">comparing</span></li>
        <li><i className="swatch swatch-quiet" aria-hidden="true"/>已归位 <span lang="en">settled</span></li>
      </ul>
      <Beads
        values={view.values}
        ids={view.ids}
        hot={view.hot}
        lo={view.lo}
        hi={view.hi}
        dim={view.phase === 'done'}
      />
      <Player
        stepCount={play.stepCount}
        playing={play.playing}
        done={play.done}
        speed={play.speed}
        status={status}
        detail={detail}
        onToggle={play.toggle}
        onStep={play.step}
        onReset={play.reset}
        onSpeed={play.setSpeed}
      />
      <Complexity route={route}/>
      <CodeBlock code={BUBBLE_CODE} line={play.frame ? play.frame.line : -1}/>
      <Trace
        frames={frames}
        index={play.index}
        describe={describeBubble}
        picture={frame => (
          <ValueLine values={frame.values} hot={frame.hot} quietFrom={frame.sortedFrom}/>
        )}
      />
    </Study>
  )
}
