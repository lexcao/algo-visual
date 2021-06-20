import React from 'react'

export default ({ nums, l, h, m, t }) => {

  const cells = nums.map(it => {

    const low = l === it ? 'bg-blue-500' : ''
    const high = h === it ? 'bg-green-500' : ''
    const target = t === it ? 'bg-red-500 scale-110' : ''
    const mid = m === it ? 'bg-yellow-500' : ''

    return <div key={it}
                className={`w-24 h-24 mx-1 shadow bg-white rounded text-2xl flex items-center justify-center ${mid} ${low} ${high} ${target}`}>
      <span className="select-none">{it}</span>
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
