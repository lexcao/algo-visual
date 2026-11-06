import React, { useMemo, useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import catalog from '../seo/catalog.json'
import { formatError, lengthError, parseInts } from '../algorithms/parse'
import { QUICK_CODE, describeQuick, quickInitial, quickSteps } from '../algorithms/quick'
import Beads from '../studio/Beads'
import Editor from '../studio/Editor'
import Player from '../studio/Player'
import Study, { Complexity } from '../studio/Study'
import Trace, { ValueLine } from '../studio/Trace'
import { usePlayback } from '../studio/usePlayback'

const route = catalog.routes.find(item => item.id === 'quick-sort')
const DEFAULT = '7 2 1 6 8 5 3 4'
const BOUNDS = { min: 2, max: 10 }

function readSequence (text) {
  const parsed = parseInts(text)
  if (!parsed.ok) return parsed
  return lengthError(parsed.nums, BOUNDS.min, BOUNDS.max)
}

export default function QuickPage () {
  const [draft, setDraft] = useState(DEFAULT)
  const [applied, setApplied] = useState(DEFAULT)
  const [error, setError] = useState(null)
  const parsed = useMemo(() => readSequence(applied), [applied])
  const nums = parsed.ok ? parsed.nums : []
  const frames = useMemo(() => {
    const next = readSequence(applied)
    return next.ok ? quickSteps(next.nums) : []
  }, [applied])
  const play = usePlayback(frames)
  const view = play.frame || quickInitial(nums)
  const status = describeQuick(play.frame || quickInitial(nums))
  const detail = view.hi < view.lo ? '划分结束' : `区间 ${view.lo}–${view.hi}`

  function onApply (event) {
    event.preventDefault()
    const next = readSequence(draft)
    if (!next.ok) {
      setError(formatError(next, BOUNDS))
      return
    }
    setError(null)
    const text = next.nums.join(' ')
    setDraft(text)
    setApplied(text)
  }

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
        <li><i className="swatch swatch-mid" aria-hidden="true"/>枢轴 <span lang="en">pivot</span></li>
        <li><i className="swatch swatch-low" aria-hidden="true"/>当前区间 <span lang="en">range</span></li>
        <li><i className="swatch swatch-quiet" aria-hidden="true"/>区间外 <span lang="en">outside</span></li>
      </ul>
      <Beads
        values={view.values}
        ids={view.ids}
        hot={view.hot}
        lo={view.lo}
        hi={view.hi}
        marks={view.marks}
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
      <CodeBlock code={QUICK_CODE} line={play.frame ? play.frame.line : -1}/>
      <Trace
        frames={frames}
        index={play.index}
        describe={describeQuick}
        picture={frame => <ValueLine values={frame.values} hot={frame.hot}/>}
      />
    </Study>
  )
}
