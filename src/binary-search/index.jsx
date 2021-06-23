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

export default () => {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  const [l, setL] = useState(-1)
  const [h, setH] = useState(-1)
  const [t, setT] = useState(-1)
  const [m, setM] = useState(-1)

  const [running, setRunning] = useState(false)
  const [finish, setFinish] = useState(false)
  const [generated, setGenerated] = useState([])

  const code = Binary_Search

  function reset () {
    setGenerated([])
    setRunning(false)
    setFinish(false)
    setL(-1)
    setH(-1)
    setM(-1)
  }

  function nextRound () {
    binarySearch(nums, l, h, t)
  }

  function binarySearch (nums, l, h, target) {
    let low = l, high = h, m = -1
    if (l <= h) {
      m = Math.floor(l + (h - l) / 2)
      if (nums[m] < target) {
        low = m + 1
        setL(low)
        setM(mid(m + 1, h))
      } else if (nums[m] > target) {
        high = m - 1
        setH(high)
        setM(mid(l, m - 1))
      } else {
        doFinish()
      }
    }
    logGenerate(low, high, mid(low, high), target, nums[m] !== target)
  }

  function mid (l, h) {
    return Math.floor(l + (h - l) / 2)
  }

  function run () {
    setL(0)
    setH(nums.length - 1)
    setM(mid(0, nums.length - 1))
    setRunning(true)

    let target = t
    if (target === -1) {
      target = random(0, nums.length - 1)
      setT(target)
    }
    logGenerate(0, nums.length - 1, mid(0, nums.length - 1), target, true)
  }

  function doFinish () {
    setFinish(true)
    setRunning(false)
  }

  function logGenerate (l, h, m, t, r) {
    setGenerated(it => it.concat({ nums, l, h, m, t, running: r }))
  }

  function runOrNextStep () {
    if (running) {
      nextRound()
    } else {
      reset()
      run()
    }
    // TODO log once here
  }

  return <>
    <Header title="Binary Search Visualization"/>

    <CodeBlock code={code}/>

    <ControlBar {...{
      target: t, found: finish ? m : undefined,
      running, onClickReset: reset, onClickNext: runOrNextStep
    }} />

    <NumsRow {...{ nums, l, h, m, t, running }} onClick={(it) => !running && !finish && setT(nums[it])}/>

    <Divider>⬇️ ⬇️ ⬇️ Step by step ⬇️ ⬇️ ⬇️</Divider>

    {generated &&
    generated.map(it => <NumsRow readonly={true} key={it.m} {...it}/>)
    }
  </>
}
