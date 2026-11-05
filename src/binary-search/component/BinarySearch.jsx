import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CodeBlock from '../../components/CodeBlock'
import { Missing } from '../../components/Shell'
import catalog from '../../seo/catalog.json'
import data from '../data/index'
import { equals, randomElement } from '../utils'
import { describeStep } from '../explain'
import ControlBar from './ControlBar'
import NumsRow from './NumsRow'

const initPos = { l: -1, h: -1, m: -1, line: -1 }

export default function Visualizer () {
  const { id } = useParams()
  const variant = data.find(item => item.id === id) || null
  const route = catalog.routes.find(item => item.id === id) || null

  const [target, setTarget] = useState(-1)
  const [pos, setPos] = useState(initPos)
  const [running, setRunning] = useState(false)
  const [generated, setGenerated] = useState([])
  const [step, setStep] = useState(1)

  useEffect(() => {
    setTarget(-1)
    setPos(initPos)
    setRunning(false)
    setGenerated([])
    setStep(1)
  }, [id])

  useEffect(() => {
    if (!variant) return
    if (equals(pos, initPos)) return
    setGenerated(list => {
      const last = list[list.length - 1]
      if (last && last.l === pos.l && last.h === pos.h && last.m === pos.m && last.line === pos.line) return list
      return list.concat({ ...pos, running, nums: variant.nums, t: target })
    })
  }, [pos])

  useEffect(() => {
    function onKey (event) {
      if (!variant) return
      const tag = event.target && event.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.target && event.target.closest && event.target.closest('.row-scroll, .code, .nav')) return
      if (event.key === 'ArrowRight' && !event.altKey && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        onNext()
      } else if ((event.key === 'r' || event.key === 'R') && !event.metaKey && !event.ctrlKey && !event.altKey) {
        onReset()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!variant || !route) return <Missing/>

  const nums = variant.nums
  const found = pos.line === variant.roles.found
  const status = describeStep(variant, pos, target)

  function updatePos (patch) {
    setPos(prev => ({ ...prev, ...patch }))
  }

  function onReset () {
    setStep(1)
    setGenerated([])
    setRunning(false)
    setPos(initPos)
  }

  function onStart () {
    const nextTarget = target !== -1 ? target : randomElement(nums)
    setTarget(nextTarget)
    setRunning(true)
    setGenerated([])
    setStep(1)
    setPos({ l: 0, h: nums.length - 1, m: -1, line: -1 })
  }

  function onNext () {
    if (found) return
    if (!running) {
      onStart()
      return
    }
    variant.onNextRound(pos, updatePos, step, setStep, target)
  }

  return (
    <article>
      <h1>
        <span className="h1-zh">{route.labelZh}</span>
        <span className="h1-en" lang="en">{route.labelEn}</span>
      </h1>
      <p className="lede">{route.introZh}</p>
      <p className="lede-en" lang="en">{route.introEn}</p>

      <ul className="legend">
        <li><i className="swatch swatch-low" aria-hidden="true"/>低 <span lang="en">low</span></li>
        <li><i className="swatch swatch-mid" aria-hidden="true"/>中 <span lang="en">mid</span></li>
        <li><i className="swatch swatch-high" aria-hidden="true"/>高 <span lang="en">high</span></li>
        <li><i className="swatch swatch-target" aria-hidden="true"/>目标 <span lang="en">target</span></li>
      </ul>

      <NumsRow
        nums={nums}
        l={pos.l}
        h={pos.h}
        m={pos.m}
        t={target}
        running={running}
        onSelect={index => {
          if (!running) setTarget(nums[index])
        }}
      />

      <ControlBar
        target={target}
        l={pos.l}
        h={pos.h}
        m={pos.m >= pos.l && pos.m <= pos.h ? pos.m : -1}
        stepCount={generated.length}
        found={found}
        running={running}
        status={status}
        onReset={onReset}
        onNext={onNext}
      />

      <CodeBlock code={variant.code} line={pos.line}/>

      <section className="trace" aria-labelledby="trace-heading">
        <h2 id="trace-heading" className="section-title">步骤记录 <span lang="en">Trace</span></h2>
        {generated.length === 0 ? (
          <>
            <p className="trace-empty">还没有步骤。选择目标后按开始。</p>
            <p className="trace-empty trace-en" lang="en">No steps yet. Choose a target, then press start.</p>
          </>
        ) : (
          <ol className="trace-list">
            {generated.map((snapshot, index) => {
              const sentence = describeStep(variant, snapshot, snapshot.t)
              return (
                <li key={index}>
                  <span className="trace-n">{index + 1}</span>
                  <div className="trace-body">
                    <p>{sentence.zh}</p>
                    <p className="trace-en" lang="en">{sentence.en}</p>
                    <NumsRow compact readonly nums={snapshot.nums} l={snapshot.l} h={snapshot.h} m={snapshot.m} t={snapshot.t}/>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </article>
  )
}
