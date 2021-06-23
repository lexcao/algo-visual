import React from 'react'
import { ofCellType } from './factory'
import { CellType } from './constans'
import classNames from 'classnames'

const Arrow = ({ color, name }) =>
  <div className="flex-1 flex-col mt-2 text-3xl flex items-center">
    <span className={color}>&#8593;</span>
    <span>{name}</span>
  </div>

const cellStyle = {
  [CellType.Low]: 'text-blue-500',
  [CellType.Mid]: 'text-yellow-500',
  [CellType.High]: 'text-green-500',
  [CellType.Target]: 'bg-red-500 scale-110',
  [CellType.Empty]: 'hidden'
}

const cellName = {
  [CellType.Low]: 'l',
  [CellType.Mid]: 'm',
  [CellType.High]: 'h',
  [CellType.Target]: 'target',
  [CellType.Empty]: ''
}

export default ({ readonly = false, nums, running, l, m, h, t, onClick }) => {

  function getFound (types) {
    if (types.includes(CellType.Target) && types.includes(CellType.Mid)) {
      return [{ color: 'text-red-500', name: '🎉' }]
    }
    return []
  }

  function getArrows (types) {
    return types.filter(it => it !== CellType.Target && it !== CellType.Empty)
      .map(it => ({ color: cellStyle[it], name: cellName[it] }))
  }

  const cards = nums.map((it, i) => {

    const types = ofCellType(i, l, m, h, t)
    console.log(readonly ? 'readonly: ' : '', types)
    const targetCell = types.find(it => it === CellType.Target)
    const arrows = running ? getArrows(types) : getFound(types)

    const basicClass = 'hover:scale-110 hover:text-3xl hover:font-bold transform w-24 h-24 mx-1 shadow bg-white rounded text-2xl flex items-center justify-center'

    const container = classNames(basicClass, {
      'cursor-none': readonly,
      'cursor-pointer': !running && !readonly,
      'cursor-not-allowed': running && !readonly,
      'bg-red-500 scale-110': targetCell
    })

    const outerContainer = classNames('flex items-center flex-col', {
      'mb-4': readonly
    })

    return <div key={i} className={outerContainer}>

      <div onClick={() => onClick && onClick(i)}
           className={container}>
        <span className="select-none">{it}</span>
      </div>

      <div className="flex-1 flex">
        {arrows && arrows.map(it =>
          <Arrow key={it.name} {...it} />
        )}
      </div>
    </div>
  })

  return (
    <section className="flex">
      <div className="bg-gray-50 flex-1">
        <div className="w-full mx-auto flex justify-center">{cards}</div>
      </div>
    </section>
  )
}
