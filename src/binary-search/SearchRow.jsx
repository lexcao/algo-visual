import React from 'react'

const Cell = () => {
  return <div key={it}
              onClick={onClickCell(it)}
              className={`w-24 h-24 mx-1 shadow bg-white rounded text-2xl flex items-center justify-center ${mid} ${low} ${high} ${target}`}>
    <span className="select-none">{it}</span>
  </div>

}

export default ({ onClickCell, nums, l, h, m, t }) => {

  const cells = nums.map((value, index) => {

    const low = l === index ? 'bg-blue-500' : ''
    const high = h === index ? 'bg-green-500' : ''
    const target = t === index ? 'bg-red-500 scale-110' : ''
    const mid = m === index ? 'bg-yellow-500' : ''

    return <div key={index}
                onClick={onClickCell && onClickCell(index, value)}
                className={`w-24 h-24 mx-1 shadow bg-white rounded text-2xl flex items-center justify-center ${mid} ${low} ${high} ${target}`}>
      <span className="select-none">{value}</span>
    </div>
  })

  return <>
    <section className="flex mb-4">
      <div className="bg-gray-50 flex-1">
        <div className="w-full mx-auto flex justify-center">{cells}</div>
      </div>
    </section>
  </>
}
