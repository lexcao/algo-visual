import React, { useEffect, useState } from 'react'
import CodeBlock from '../../components/CodeBlock'
import ControlBar from './ControlBar'
import NumsRow from './NumsRow'
import { useHistory, useParams } from 'react-router-dom'
import { equals, randomElement } from '../utils'
import data from '../data/index'

const Divider = ({ children }) => <section className="flex justify-center items-center my-8">
  <div className="w-6/12 border-t-2 flex justify-center">
    <div className="flex flex-col items-center">
      <span className="flex-1 font-medium text-2xl text-gray-700 pt-4">{children}</span>
    </div>
  </div>
</section>

const initPos = { l: -1, h: -1, m: -1, line: -1 }

const dataMap = {}

for (let d of data) {
  dataMap[d.id] = d
}

export default () => {

  const { id } = useParams()
  if (!id || !dataMap[id]) {
    useHistory().replace('/binary-search')
  }

  const { onNextRound, nums, code } = dataMap[id] || data[0]

  const [target, setTarget] = useState(-1)
  const [pos, setPos] = useState(initPos)

  const [running, setRunning] = useState(false)
  const [finish, setFinish] = useState(false)
  const [generated, setGenerated] = useState([])
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (equals(pos, initPos)) {
      return
    }
    setGenerated(it => it.concat({ ...pos, running, nums, t: target }))
  }, [pos])

  function reset () {
    setStep(1)
    setGenerated([])
    setRunning(false)
    setFinish(false)

    updatePos(initPos)
  }

  const updatePos = (pos) => {
    setPos(prev => ({ ...prev, ...pos }))
  }

  function run () {
    setRunning(true)

    setTarget(it => it !== -1 ? it : randomElement(nums))

    updatePos({ l: 0, h: nums.length - 1 })
  }

  function checkFinish () {
    if (nums[pos.m] === target) {
      setFinish(true)
      setRunning(false)
    }
  }

  function runOrNextStep () {
    if (running) {
      onNextRound(pos, updatePos, step, setStep, target)
      checkFinish()
    } else {
      reset()
      run()
    }
  }

  return <>
    <CodeBlock code={code} line={pos.line}/>

    <ControlBar
      target={target}
      found={finish ? pos.m : -1}
      running={running}
      onClickReset={reset}
      onClickNext={runOrNextStep}/>

    <NumsRow {...{ ...pos, nums, t: target, running }} onClick={(it) => {
      !running && setTarget(nums[it])
    }}/>

    <Divider>⬇️ ⬇️ ⬇️ Step by Step ⬇️ ⬇️ ⬇️</Divider>

    {generated && generated.map(it => {
      return <NumsRow readonly={true} key={'' + it.l + it.m + it.h + it.running + it.line} {...it}/>
    })}
  </>
}
