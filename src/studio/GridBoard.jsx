import React from 'react'
import { COLS, GOAL, ROWS, START } from '../algorithms/grid'

function includes (list, r, c) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].r === r && list[i].c === c) return true
  }
  return false
}

export default function GridBoard ({
  walls,
  onToggle,
  current,
  frontier,
  visited,
  path,
  found
}) {
  const wallSet = new Set(walls)
  const cells = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = r + ',' + c
      const isStart = r === START.r && c === START.c
      const isGoal = r === GOAL.r && c === GOAL.c
      const isWall = wallSet.has(key)
      const isCurrent = current && current.r === r && current.c === c
      const onPath = found && includes(path, r, c)
      const inFrontier = includes(frontier, r, c)
      const wasVisited = includes(visited, r, c)
      const className = [
        'cell',
        isWall ? 'is-wall' : '',
        isCurrent || onPath ? 'is-current' : '',
        !isCurrent && !onPath && inFrontier ? 'is-frontier' : '',
        !isCurrent && !onPath && !inFrontier && wasVisited ? 'is-seen' : ''
      ].filter(Boolean).join(' ')
      let name = `第 ${r + 1} 行第 ${c + 1} 列`
      if (isStart) name += '，起点'
      else if (isGoal) name += '，终点'
      else if (isWall) name += '，墙，点击拆掉'
      else name += '，空地，点击加墙'
      cells.push(
        <button
          key={key}
          type="button"
          className={className}
          aria-pressed={isWall}
          disabled={isStart || isGoal}
          aria-label={name}
          onClick={() => onToggle(r, c)}
        >
          {isStart ? '起' : isGoal ? '终' : ''}
        </button>
      )
    }
  }

  return (
    <div className="board" role="grid" aria-label="网格">
      {cells}
    </div>
  )
}
