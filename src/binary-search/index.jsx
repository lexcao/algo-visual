import React, { useState } from 'react'
import Header from '../components/Header'
import CodeBlock from '../components/CodeBlock'
import { Binary_Search } from './constans'
import NumsRow from './NumsRow'
import ControlBar from './ControlBar'

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const Divider = ({ children }) => <section className="flex justify-center items-center my-8">
  <div className="w-6/12 border-t-2 flex justify-center">
    <div className="flex flex-col items-center">
      <span className="flex-1 font-medium text-2xl text-gray-700 pt-4">{children}</span>
    </div>
  </div>
</section>

const Lines = Object.freeze({
  None: -1,
  Assign_M: 3,
  Update_L: 5,
  Update_H: 7,
  Return_M: 9
})

export default () => {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  const [l, setL] = useState(-1)
  const [h, setH] = useState(-1)
  const [t, setT] = useState(-1)
  const [m, setM] = useState(-1)

  const [running, setRunning] = useState(false)
  const [finish, setFinish] = useState(false)
  const [generated, setGenerated] = useState([])

  const [line, setLine] = useState(Lines.None)
  const [step, setStep] = useState(1)

  const code = Binary_Search

  function reset () {
    setGenerated([])
    setRunning(false)
    setFinish(false)
    setL(-1)
    setH(-1)
    setM(-1)
    setLine(Lines.None)
  }

  function nextRound () {
    if (step === 1) {
      step1_PickMid()
      setStep(2)
    } else if (step === 2) {
      step2_MoveCursor()
      setStep(1)
    }
  }

  function step1_PickMid () {
    setM(mid(l, h))
    setLine(Lines.Assign_M)
    logGenerate(l, h, mid(l, h), t, true)
  }

  function step2_MoveCursor () {
    let low = l, high = h
    if (nums[m] < t) {
      low = m + 1
      setL(low)
      setLine(Lines.Update_L)
    } else if (nums[m] > t) {
      high = m - 1
      setH(high)
      setLine(Lines.Update_H)
    } else {
      doFinish()
      setLine(Lines.Return_M)
    }
    logGenerate(low, high, m, t, nums[m] !== t)
  }

  function mid (l, h) {
    return Math.floor(l + (h - l) / 2)
  }

  function run () {
    setL(0)
    setH(nums.length - 1)
    setRunning(true)

    let target = t
    if (target === -1) {
      target = random(0, nums.length - 1)
      setT(target)
    }
    logGenerate(0, nums.length - 1, -1, target, true)
  }

  function doFinish () {
    setFinish(true)
    setRunning(false)
  }

  // invoke in one place when react state changes immediately
  function logGenerate (l, h, m, t, running) {
    if (!running) {
      l = -1
      h = -1
    }
    setGenerated(it => it.concat({ nums, l, h, m, t, running }))
  }

  function runOrNextStep () {
    if (running) {
      nextRound()
    } else {
      reset()
      run()
    }
  }

  return <>
    <Header title="Binary Search Visualization"/>

    <CodeBlock {...{ code, line }}/>

    <ControlBar {...{
      target: t, found: finish ? m : undefined,
      running, onClickReset: reset, onClickNext: runOrNextStep
    }} />

    <NumsRow {...{ nums, l, h, m, t, running }} onClick={(it) => !running && !finish && setT(nums[it])}/>

    <Divider>⬇️ ⬇️ ⬇️ Step by step ⬇️ ⬇️ ⬇️</Divider>

    {generated &&
    generated.map(it => <NumsRow readonly={true} key={'' + it.l + it.m + it.h} {...it}/>)
    }
  </>
}
