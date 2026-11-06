import React, { useMemo, useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import catalog from '../seo/catalog.json'
import { formatError, lengthError, parseInts } from '../algorithms/parse'
import {
  TWO_POINTERS_CODE,
  describeTwoPointers,
  isNonDecreasing,
  twoPointerInitial,
  twoPointerSteps
} from '../algorithms/two-pointers'
import Editor from '../studio/Editor'
import Player from '../studio/Player'
import RangeRow from '../studio/RangeRow'
import Study, { Complexity } from '../studio/Study'
import Trace, { ValueLine } from '../studio/Trace'
import { usePlayback } from '../studio/usePlayback'

const route = catalog.routes.find(item => item.id === 'two-pointers')
const DEFAULT = '1 3 4 6 8 11'
const DEFAULT_TARGET = '14'
const BOUNDS = { min: 2, max: 10 }

function readSequence (text) {
  const parsed = parseInts(text)
  if (!parsed.ok) return parsed
  const sized = lengthError(parsed.nums, BOUNDS.min, BOUNDS.max)
  if (!sized.ok) return sized
  if (!isNonDecreasing(sized.nums)) return { ok: false, error: 'unsorted' }
  return sized
}

export default function TwoPointersPage () {
  const [draft, setDraft] = useState(DEFAULT)
  const [applied, setApplied] = useState(DEFAULT)
  const [targetDraft, setTargetDraft] = useState(DEFAULT_TARGET)
  const [target, setTarget] = useState(14)
  const [error, setError] = useState(null)
  const parsed = useMemo(() => readSequence(applied), [applied])
  const nums = parsed.ok ? parsed.nums : []
  const frames = useMemo(() => {
    const next = readSequence(applied)
    return next.ok ? twoPointerSteps(next.nums, target) : []
  }, [applied, target])
  const play = usePlayback(frames)
  const view = play.frame || twoPointerInitial(nums)
  const status = describeTwoPointers(play.frame || twoPointerInitial(nums))
  const marks = {}
  if (view.l >= 0) marks[view.l] = ['左']
  if (view.r >= 0) {
    marks[view.r] = marks[view.r] ? marks[view.r].concat('右') : ['右']
  }

  function onApply (event) {
    event.preventDefault()
    const next = readSequence(draft)
    if (!next.ok) {
      setError(formatError(next, BOUNDS))
      return
    }
    const targetParsed = parseInts(targetDraft)
    if (!targetParsed.ok || targetParsed.nums.length !== 1) {
      setError(formatError(targetParsed.ok ? { error: 'token', token: targetDraft } : targetParsed, BOUNDS))
      return
    }
    setError(null)
    const text = next.nums.join(' ')
    setDraft(text)
    setApplied(text)
    setTarget(targetParsed.nums[0])
    setTargetDraft(String(targetParsed.nums[0]))
  }

  function sortDraft () {
    const parsedDraft = parseInts(draft)
    if (!parsedDraft.ok) {
      setError(formatError(parsedDraft, BOUNDS))
      return
    }
    setDraft(parsedDraft.nums.slice().sort((a, b) => a - b).join(' '))
    setError(null)
  }

  return (
    <Study route={route}>
      <Editor
        label="升序序列"
        labelEn="Sorted sequence"
        value={draft}
        onChange={setDraft}
        onSubmit={onApply}
        error={error}
      >
        <label className="field field-short">
          <span className="field-k">目标 <span lang="en">Target</span></span>
          <input
            value={targetDraft}
            onChange={event => setTargetDraft(event.target.value)}
            inputMode="numeric"
            autoComplete="off"
          />
        </label>
        <button type="button" className="btn btn-ghost" onClick={sortDraft}>排成升序</button>
      </Editor>
      <ul className="legend">
        <li><i className="swatch swatch-low" aria-hidden="true"/>左与右 <span lang="en">ends</span></li>
        <li><i className="swatch swatch-mid" aria-hidden="true"/>找到的一对 <span lang="en">pair</span></li>
        <li><i className="swatch swatch-quiet" aria-hidden="true"/>已排除 <span lang="en">discarded</span></li>
      </ul>
      <RangeRow
        values={view.values}
        lo={Math.min(view.l, view.r)}
        hi={Math.max(view.l, view.r)}
        hot={view.found ? [view.l, view.r] : []}
        marks={marks}
        label={`左 ${view.l}，右 ${view.r}`}
      />
      <Player
        stepCount={play.stepCount}
        playing={play.playing}
        done={play.done}
        speed={play.speed}
        status={status}
        detail={view.sum == null ? `目标 ${target}` : `和 ${view.sum}  目标 ${target}`}
        onToggle={play.toggle}
        onStep={play.step}
        onReset={play.reset}
        onSpeed={play.setSpeed}
      />
      <Complexity route={route}/>
      <CodeBlock code={TWO_POINTERS_CODE} line={play.frame ? play.frame.line : -1}/>
      <Trace
        frames={frames}
        index={play.index}
        describe={describeTwoPointers}
        picture={frame => (
          <ValueLine
            values={frame.values}
            hot={frame.found ? [frame.l, frame.r] : [frame.l, frame.r]}
            quietBefore={Math.min(frame.l, frame.r)}
            quietFrom={Math.max(frame.l, frame.r) + 1}
          />
        )}
      />
    </Study>
  )
}
