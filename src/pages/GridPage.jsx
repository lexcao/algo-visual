import React, { useMemo, useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import catalog from '../seo/catalog.json'
import {
  BFS_CODE,
  DFS_CODE,
  SAMPLE_WALLS,
  describeGrid,
  gridSteps
} from '../algorithms/grid'
import GridBoard from '../studio/GridBoard'
import Player from '../studio/Player'
import Study, { Complexity } from '../studio/Study'
import Trace from '../studio/Trace'
import { usePlayback } from '../studio/usePlayback'

const route = catalog.routes.find(item => item.id === 'grid-search')

export default function GridPage () {
  const [walls, setWalls] = useState(() => SAMPLE_WALLS.slice())
  const [mode, setMode] = useState('bfs')
  const wallKey = walls.join('|')
  const frames = useMemo(() => {
    const list = wallKey ? wallKey.split('|') : []
    return gridSteps(list, mode)
  }, [wallKey, mode])
  const play = usePlayback(frames)
  const view = play.frame || {
    phase: 'idle',
    current: null,
    frontier: [],
    visited: [],
    path: [],
    mode
  }
  const status = describeGrid(play.frame || { phase: 'idle', mode })
  const kind = mode === 'dfs' ? '栈' : '队列'
  const nextIndex = mode === 'dfs' ? view.frontier.length - 1 : 0

  function onToggle (r, c) {
    const key = r + ',' + c
    setWalls(current => {
      const next = current.indexOf(key) === -1
        ? current.concat(key)
        : current.filter(item => item !== key)
      next.sort()
      return next
    })
  }

  return (
    <Study route={route}>
      <div className="editor">
        <div className="speed" role="group" aria-label="搜索方式">
          <button type="button" aria-pressed={mode === 'bfs'} onClick={() => setMode('bfs')}>广度</button>
          <button type="button" aria-pressed={mode === 'dfs'} onClick={() => setMode('dfs')}>深度</button>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => setWalls(SAMPLE_WALLS.slice())}>
          恢复示例
        </button>
      </div>
      <ul className="legend">
        <li><i className="swatch swatch-low" aria-hidden="true"/>墙 <span lang="en">wall</span></li>
        <li><i className="swatch swatch-mid" aria-hidden="true"/>当前 <span lang="en">current</span></li>
        <li><i className="swatch swatch-frontier" aria-hidden="true"/>{kind} <span lang="en">{mode === 'dfs' ? 'stack' : 'queue'}</span></li>
        <li><i className="swatch swatch-seen" aria-hidden="true"/>已取出 <span lang="en">visited</span></li>
      </ul>
      <GridBoard
        walls={walls}
        onToggle={onToggle}
        current={view.current}
        frontier={view.frontier}
        visited={view.visited}
        path={view.path}
        found={view.phase === 'found'}
      />
      <div className="frontier-row" aria-label={kind}>
        <span className="field-k">{kind}</span>
        {view.frontier.length === 0 ? <span className="chip is-quiet">空</span> : view.frontier.map((cell, index) => (
          <span key={`${cell.r}-${cell.c}-${index}`} className={index === nextIndex ? 'chip is-next' : 'chip'}>
            {cell.r},{cell.c}
          </span>
        ))}
      </div>
      <p className="hint">点空地加墙，点墙拆掉。起点和终点固定。</p>
      <Player
        stepCount={play.stepCount}
        playing={play.playing}
        done={play.done}
        speed={play.speed}
        status={status}
        detail={`${kind} ${view.frontier.length}`}
        onToggle={play.toggle}
        onStep={play.step}
        onReset={play.reset}
        onSpeed={play.setSpeed}
      />
      <Complexity route={route}/>
      <CodeBlock code={mode === 'dfs' ? DFS_CODE : BFS_CODE} line={play.frame ? play.frame.line : -1}/>
      <Trace frames={frames} index={play.index} describe={describeGrid}/>
    </Study>
  )
}
