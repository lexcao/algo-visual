import { describe, expect, it } from 'vitest'
import { gridSteps, GOAL, SAMPLE_WALLS } from './grid'
import { quickSteps, QUICK_CODE } from './quick'
import { isNonDecreasing, twoPointerSteps } from './two-pointers'
import { windowSteps } from './window'

function sorted (values) {
  return values.slice().sort((a, b) => a - b)
}

function lineCount (code) {
  return code.trimEnd().split('\n').length
}

describe('quickSteps', () => {
  it('sorts and leaves the input untouched', () => {
    const input = [7, 2, 1, 6, 8, 5, 3, 4]
    const frames = quickSteps(input)
    expect(input).toEqual([7, 2, 1, 6, 8, 5, 3, 4])
    expect(frames[frames.length - 1].values).toEqual(sorted(input))
    expect(frames[frames.length - 1].phase).toBe('done')
  })

  it('plants each pivot in its final index', () => {
    const input = [7, 2, 1, 6, 8, 5, 3, 4]
    const frames = quickSteps(input)
    const expectSorted = sorted(input)
    const placed = []
    for (const frame of frames) {
      expect(frame.line).toBeGreaterThanOrEqual(1)
      expect(frame.line).toBeLessThanOrEqual(lineCount(QUICK_CODE))
      expect(frame.ids.slice().sort((a, b) => a - b)).toEqual(input.map((_, index) => index))
      if (frame.phase === 'place') {
        const index = frame.hot[0]
        expect(frame.values[index]).toBe(expectSorted[index])
        placed.push(index)
      }
      for (let i = 0; i < placed.length; i++) {
        expect(frame.values[placed[i]]).toBe(expectSorted[placed[i]])
      }
    }
    expect(placed.length).toBeGreaterThan(0)
  })

  it('sorts duplicates and a single value', () => {
    expect(quickSteps([1, 1, 1]).at(-1).values).toEqual([1, 1, 1])
    expect(quickSteps([4]).at(-1).values).toEqual([4])
    expect(quickSteps([1, 2, 3]).at(-1).values).toEqual([1, 2, 3])
  })
})

describe('gridSteps', () => {
  it('finds a shortest path on an open grid', () => {
    const frames = gridSteps([], 'bfs')
    const found = frames.find(frame => frame.phase === 'found')
    expect(found.path[0]).toEqual({ r: 0, c: 0 })
    expect(found.path[found.path.length - 1]).toEqual(GOAL)
    expect(found.path).toHaveLength(12)
    for (let i = 1; i < found.path.length; i++) {
      const dr = Math.abs(found.path[i].r - found.path[i - 1].r)
      const dc = Math.abs(found.path[i].c - found.path[i - 1].c)
      expect(dr + dc).toBe(1)
    }
  })

  it('walks the sample maze and stops at a wall cut', () => {
    const bfs = gridSteps(SAMPLE_WALLS, 'bfs').find(frame => frame.phase === 'found')
    const dfs = gridSteps(SAMPLE_WALLS, 'dfs').find(frame => frame.phase === 'found')
    expect(bfs.path[0]).toEqual({ r: 0, c: 0 })
    expect(bfs.path[bfs.path.length - 1]).toEqual(GOAL)
    expect(dfs.path.length).toBeGreaterThanOrEqual(bfs.path.length)
    const blocked = gridSteps(['0,3', '1,3', '2,3', '3,3', '4,3'], 'bfs')
    expect(blocked[blocked.length - 1].phase).toBe('none')
  })

  it('explores depth-first by going right before down', () => {
    const frames = gridSteps([], 'dfs')
    const visits = frames.filter(frame => frame.phase === 'visit' || frame.phase === 'found')
    expect(visits[0].current).toEqual({ r: 0, c: 0 })
    expect(visits[1].current).toEqual({ r: 0, c: 1 })
    const found = frames.find(frame => frame.phase === 'found')
    expect(found.path.length).toBeGreaterThanOrEqual(12)
    expect(found.mode).toBe('dfs')
  })

  it('refuses a walled start', () => {
    expect(gridSteps(['0,0'], 'bfs')).toEqual([])
  })
})

describe('twoPointerSteps', () => {
  it('finds the outer pair and a later pair', () => {
    const found = twoPointerSteps([1, 2, 3, 4, 6], 7)
    const hit = found.find(frame => frame.phase === 'found')
    expect(hit).toMatchObject({ l: 0, r: 4, sum: 7 })
    const inner = twoPointerSteps([1, 3, 4, 6, 8, 11], 10)
    const pair = inner.find(frame => frame.phase === 'found')
    expect(pair.values[pair.l] + pair.values[pair.r]).toBe(10)
  })

  it('reports a miss and only moves the pointers inward', () => {
    const frames = twoPointerSteps([1, 2, 3, 9], 100)
    expect(frames[frames.length - 1].phase).toBe('miss')
    let l = 0
    let r = 3
    for (const frame of frames) {
      expect(frame.l).toBeGreaterThanOrEqual(l)
      expect(frame.r).toBeLessThanOrEqual(r)
      l = frame.l
      r = frame.r
    }
    expect(isNonDecreasing([1, 2, 2, 5])).toBe(true)
    expect(isNonDecreasing([1, 3, 2])).toBe(false)
  })
})

describe('windowSteps', () => {
  it('tracks the maximum sum of a fixed window', () => {
    const frames = windowSteps([2, 1, 5, 1, 3, 2], 3)
    const done = frames[frames.length - 1]
    expect(done).toMatchObject({ phase: 'done', sum: 9, best: 9, left: 2, right: 4 })
    const sums = frames.filter(frame => frame.phase === 'slide' || frame.phase === 'seed').map(frame => frame.sum)
    expect(sums).toEqual([8, 7, 9, 6])
  })

  it('handles a window of one and a window of the whole array', () => {
    const ones = windowSteps([4, 1, 7], 1)
    expect(ones[ones.length - 1].sum).toBe(7)
    const all = windowSteps([4, 1, 7], 3)
    expect(all.map(frame => frame.phase)).toEqual(['seed', 'done'])
    expect(all[0].sum).toBe(12)
    expect(windowSteps([1, 2], 3)).toEqual([])
  })
})
