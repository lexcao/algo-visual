import React, { useMemo, useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import catalog from '../seo/catalog.json'
import { formatError, lengthError, parseInts } from '../algorithms/parse'
import { WINDOW_CODE, describeWindow, windowInitial, windowSteps } from '../algorithms/window'
import Editor from '../studio/Editor'
import Player from '../studio/Player'
import RangeRow from '../studio/RangeRow'
import Study, { Complexity } from '../studio/Study'
import Trace, { ValueLine } from '../studio/Trace'
import { usePlayback } from '../studio/usePlayback'

const route = catalog.routes.find(item => item.id === 'sliding-window')
const DEFAULT = '2 1 5 1 3 2'
const BOUNDS = { min: 2, max: 12 }

function readSequence (text) {
  const parsed = parseInts(text)
  if (!parsed.ok) return parsed
  return lengthError(parsed.nums, BOUNDS.min, BOUNDS.max)
}

export default function WindowPage () {
  const [draft, setDraft] = useState(DEFAULT)
  const [applied, setApplied] = useState(DEFAULT)
  const [kDraft, setKDraft] = useState('3')
  const [k, setK] = useState(3)
  const [error, setError] = useState(null)
  const parsed = useMemo(() => readSequence(applied), [applied])
  const nums = parsed.ok ? parsed.nums : []
  const frames = useMemo(() => {
    const next = readSequence(applied)
    return next.ok ? windowSteps(next.nums, k) : []
  }, [applied, k])
  const play = usePlayback(frames)
  const base = windowInitial(nums, k)
  const view = play.frame || base
  const status = describeWindow(play.frame || base)
  const marks = {}
  if (view.phase === 'best' || view.phase === 'done') marks[view.bestL] = ['最优']
  const hot = view.phase === 'slide' || view.phase === 'best' ? [view.right] : []

  function onApply (event) {
    event.preventDefault()
    const next = readSequence(draft)
    if (!next.ok) {
      setError(formatError(next, BOUNDS))
      return
    }
    const width = parseInts(kDraft)
    if (!width.ok || width.nums.length !== 1) {
      setError(formatError(width.ok ? { error: 'k' } : width, BOUNDS))
      return
    }
    const size = width.nums[0]
    if (size < 1 || size > next.nums.length) {
      setError(formatError({ error: 'k' }, BOUNDS))
      return
    }
    setError(null)
    const text = next.nums.join(' ')
    setDraft(text)
    setApplied(text)
    setK(size)
    setKDraft(String(size))
  }

  const detail = view.sum == null ? `k ${k}` : `和 ${view.sum}  最大 ${view.best}`

  return (
    <Study route={route}>
      <Editor
        label="序列"
        labelEn="Sequence"
        value={draft}
        onChange={setDraft}
        onSubmit={onApply}
        error={error}
      >
        <label className="field field-short">
          <span className="field-k">k <span lang="en">Width</span></span>
          <input
            value={kDraft}
            onChange={event => setKDraft(event.target.value)}
            inputMode="numeric"
            autoComplete="off"
          />
        </label>
      </Editor>
      <ul className="legend">
        <li><i className="swatch swatch-low" aria-hidden="true"/>窗口 <span lang="en">window</span></li>
        <li><i className="swatch swatch-mid" aria-hidden="true"/>新进入 <span lang="en">entering</span></li>
        <li><i className="swatch swatch-quiet" aria-hidden="true"/>窗口外 <span lang="en">outside</span></li>
      </ul>
      <RangeRow
        values={view.values}
        lo={view.left}
        hi={view.right}
        hot={hot}
        marks={marks}
        label={`窗口 ${view.left} 到 ${view.right}`}
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
      <CodeBlock code={WINDOW_CODE} line={play.frame ? play.frame.line : -1}/>
      <Trace
        frames={frames}
        index={play.index}
        describe={describeWindow}
        picture={frame => <ValueLine values={frame.values} hot={[frame.left, frame.right]}/>}
      />
    </Study>
  )
}
