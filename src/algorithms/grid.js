export const ROWS = 5
export const COLS = 8
export const START = { r: 0, c: 0 }
export const GOAL = { r: 4, c: 7 }
export const SAMPLE_WALLS = Object.freeze([
  '0,2', '1,2', '1,4', '2,4', '2,6', '3,1', '3,2', '3,3', '4,4'
])

const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]]

export const BFS_CODE = `\
function bfs(grid, start, goal) {
  const queue = [start]
  const seen = new Set([key(start)])
  while (queue.length) {
    const cur = queue.shift()
    if (same(cur, goal)) return cur
    for (const next of neighbors(cur)) {
      if (blocked(grid, next, seen)) continue
      seen.add(key(next))
      queue.push(next)
    }
  }
  return null
}
`

export const DFS_CODE = `\
function dfs(grid, start, goal) {
  const stack = [start]
  const seen = new Set([key(start)])
  while (stack.length) {
    const cur = stack.pop()
    if (same(cur, goal)) return cur
    for (const next of neighbors(cur)) {
      if (blocked(grid, next, seen)) continue
      seen.add(key(next))
      stack.push(next)
    }
  }
  return null
}
`

export const BFS_LINES = Object.freeze({
  init: 2,
  visit: 5,
  found: 6,
  expand: 10,
  miss: 13
})

export const DFS_LINES = BFS_LINES

function keyOf (cell) {
  return cell.r + ',' + cell.c
}

function pathTo (parent, cell) {
  const path = []
  let cursor = cell
  const guard = new Set()
  while (cursor) {
    const key = keyOf(cursor)
    if (guard.has(key)) break
    guard.add(key)
    path.push({ r: cursor.r, c: cursor.c })
    cursor = parent.get(key) || null
  }
  path.reverse()
  return path
}

export function gridSteps (wallList, mode) {
  const walls = new Set(wallList)
  const frames = []
  const useDfs = mode === 'dfs'
  const lines = useDfs ? DFS_LINES : BFS_LINES
  if (walls.has('0,0') || walls.has(GOAL.r + ',' + GOAL.c)) return frames

  const seen = new Set(['0,0'])
  const parent = new Map()
  const bag = [{ r: START.r, c: START.c }]
  const visited = []

  function snap (extra) {
    frames.push({
      phase: extra.phase,
      current: extra.current,
      frontier: bag.map(cell => ({ r: cell.r, c: cell.c })),
      visited: visited.map(cell => ({ r: cell.r, c: cell.c })),
      path: extra.path,
      line: extra.line,
      mode: useDfs ? 'dfs' : 'bfs'
    })
  }

  snap({
    phase: 'start',
    current: null,
    path: [{ r: START.r, c: START.c }],
    line: lines.init
  })

  while (bag.length) {
    const current = useDfs ? bag.pop() : bag.shift()
    visited.push(current)
    const path = pathTo(parent, current)
    if (current.r === GOAL.r && current.c === GOAL.c) {
      snap({ phase: 'found', current, path, line: lines.found })
      return frames
    }
    snap({ phase: 'visit', current, path, line: lines.visit })
    const nexts = []
    for (let d = 0; d < DIRS.length; d++) {
      const nr = current.r + DIRS[d][0]
      const nc = current.c + DIRS[d][1]
      if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS) continue
      const key = nr + ',' + nc
      if (walls.has(key) || seen.has(key)) continue
      nexts.push({ r: nr, c: nc })
    }
    const ordered = useDfs ? nexts.slice().reverse() : nexts
    for (let i = 0; i < ordered.length; i++) {
      const next = ordered[i]
      seen.add(keyOf(next))
      parent.set(keyOf(next), current)
      bag.push(next)
    }
    snap({ phase: 'expand', current, path, line: lines.expand })
  }

  snap({ phase: 'none', current: null, path: [], line: lines.miss })
  return frames
}

function cellText (cell) {
  if (!cell) return ''
  return `(${cell.r}, ${cell.c})`
}

export function describeGrid (frame) {
  if (!frame || frame.phase === 'idle') {
    return {
      zh: '从左上角走到右下角。点格子可以加墙或拆墙。',
      en: 'Walk from the top left to the bottom right. Click a cell to add or remove a wall.'
    }
  }
  const kind = frame.mode === 'dfs' ? '栈' : '队列'
  const kindEn = frame.mode === 'dfs' ? 'stack' : 'queue'
  if (frame.phase === 'start') {
    return {
      zh: `起点 (0, 0) 放进${kind}。`,
      en: `The start (0, 0) goes into the ${kindEn}.`
    }
  }
  if (frame.phase === 'found') {
    return {
      zh: `到达终点 ${cellText(frame.current)}。这条路有 ${frame.path.length} 个格子。`,
      en: `The goal ${cellText(frame.current)} is reached. The path has ${frame.path.length} cells.`
    }
  }
  if (frame.phase === 'none') {
    return {
      zh: `${kind}空了，终点被墙隔开，走不到。`,
      en: `The ${kindEn} is empty. Walls separate the goal, so there is no path.`
    }
  }
  if (frame.phase === 'visit') {
    return {
      zh: `取出 ${cellText(frame.current)}，准备看它的四个邻居。`,
      en: `Take ${cellText(frame.current)} and look at its four neighbors.`
    }
  }
  const added = frame.frontier.length
  return {
    zh: `从 ${cellText(frame.current)} 扩展。${kind}里现在有 ${added} 个格子。`,
    en: `Expand from ${cellText(frame.current)}. The ${kindEn} now holds ${added} cells.`
  }
}
