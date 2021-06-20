import React, { useState } from 'react'
import Header from '../compoents/Header'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import Grid from './Grid'

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

export default () => {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  const [l, setL] = useState(-1)
  const [h, setH] = useState(-1)
  const [t, setT] = useState(-1)

  const [m, setM] = useState(-1)

  const [running, setRunning] = useState(false)
  const [finish, setFinish] = useState(false)
  const [generated, setGenerated] = useState([])

  const code = `function binarySearch(nums, l, h, target) {
  while (l <= h) {
    const m = Math.floor(l + (h - l) / 2)
    if (nums[m] < target) {
      l = m + 1
    } else if (nums[m] > target) {
      h = m - 1
    } else {
      return m
    }
  }
  return -1
}`

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
      setM(m)
      if (nums[m] < target) {
        low = m + 1
        setL(low)
      } else if (nums[m] > target) {
        high = m - 1
        setH(high)
      } else {
        setFinish(true)
        setRunning(false)
      }
    }
    logGenerate(low, high, m, target)
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
    logGenerate(0, nums.length - 1, -1, target)
  }

  function logGenerate (l, h, m, t) {
    if (finish) {
      return
    }

    setGenerated(it => it.concat({ nums, l, h, m, t }))
  }

  function runOrNextStep () {
    if (running) {
      nextRound()
    } else {
      reset()
      run()
    }
  }

  const cards = nums.map(it => {
    const low = l === it ? 'bg-blue-500' : ''
    const high = h === it ? 'bg-green-500' : ''
    const target = t === it ? 'bg-red-500 scale-110' : ''
    const mid = m === it ? 'bg-yellow-500' : ''
    const pointer = running ? 'cursor-not-allowed' : 'cursor-pointer'
    return <div key={it} onClick={() => !running && setT(it)}
                className={`${pointer} hover:scale-110 hover:text-3xl hover:font-bold transform w-24 h-24 mx-1 shadow bg-white rounded text-2xl flex items-center justify-center ${mid} ${low} ${high} ${target}`}>
      <span className="select-none">{it}</span>
    </div>
  })

  return <>
    <Header title="Binary Search Visualization"/>

    <section className="flex items-center justify-center flex-wrap mb-8"
             style={{ backgroundColor: '#2B2B2B' }}>
      <div className="w-min">
        <SyntaxHighlighter
          customStyle={{ padding: '1em' }}
          language="javascript"
          style={darcula}>
          {code}
        </SyntaxHighlighter>
      </div>
    </section>

    <section className="flex justify-center my-8">
      <div className="flex justify-between w-6/12 items-center">
        <label className="text-gray-900 font-medium text-2xl">Click target to search >> {t}</label>
        <a onClick={reset} className="cursor-pointer text-gray-700 inline-flex items-center uppercase">reset</a>
        <button
          onClick={runOrNextStep}
          className="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0">{!running ? 'Start' : 'Next Step'}
        </button>
      </div>
    </section>

    {finish &&
    <section className="flex justify-center my-8">
      <span className="font-medium text-2xl">🎉 Found</span>
    </section>
    }

    <section className="flex">
      <div className="bg-gray-50 flex-1">
        <div className="w-full mx-auto flex justify-center">{cards}</div>
      </div>
    </section>

    <section className="flex justify-center items-center my-8">
      <div className="w-6/12 border-t-2 flex justify-center">
        <div className="flex flex-col items-center">
          <a className="flex-1 font-medium text-2xl text-gray-700 cursor-pointer pt-4">Generated step
            by step</a>
          <span className="font-medium">V</span>
        </div>
      </div>
    </section>

    {generated &&
    generated.map(it => <Grid key={it.m} {...it}/>)
    }
  </>
}
