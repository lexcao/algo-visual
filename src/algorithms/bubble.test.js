import { describe, expect, it } from 'vitest'
import { bubbleSteps, describeBubble, BUBBLE_CODE, BUBBLE_LINES } from './bubble'
import { formatError, parseInts } from './parse'

function sortedCopy (values) {
  return values.slice().sort((a, b) => a - b)
}

function assertPermutation (frame, ids, values) {
  expect(frame.ids.slice().sort((a, b) => a - b)).toEqual(ids)
  expect(frame.values).toHaveLength(values.length)
}

describe('bubbleSteps', () => {
  it('sorts a classic pass and records each swap', () => {
    const input = [5, 1, 4, 2, 8]
    const frames = bubbleSteps(input)
    expect(input).toEqual([5, 1, 4, 2, 8])
    const last = frames[frames.length - 1]
    expect(last.phase).toBe('done')
    expect(last.values).toEqual([1, 2, 4, 5, 8])
    const swaps = frames.filter(frame => frame.phase === 'swap')
    expect(swaps.length).toBeGreaterThan(0)
    expect(swaps[0].values).toEqual([1, 5, 4, 2, 8])
  })

  it('stops after one clean pass when the array is sorted', () => {
    const frames = bubbleSteps([1, 2, 3, 4])
    expect(frames.some(frame => frame.phase === 'swap')).toBe(false)
    expect(frames.filter(frame => frame.phase === 'compare')).toHaveLength(3)
    expect(frames[frames.length - 1].phase).toBe('done')
    expect(frames[frames.length - 1].line).toBe(BUBBLE_LINES.done)
  })

  it('keeps duplicate values and a stable identity for each item', () => {
    const frames = bubbleSteps([3, 1, 2, 1])
    const ids = [0, 1, 2, 3]
    for (const frame of frames) {
      assertPermutation(frame, ids, [3, 1, 2, 1])
      expect(frame.line).toBeGreaterThanOrEqual(1)
      expect(frame.line).toBeLessThanOrEqual(BUBBLE_CODE.trimEnd().split('\n').length)
      const sentence = describeBubble(frame)
      expect(sentence.zh.length).toBeGreaterThan(0)
      expect(sentence.en.length).toBeGreaterThan(0)
    }
    expect(frames[frames.length - 1].values).toEqual(sortedCopy([3, 1, 2, 1]))
  })

  it('handles a single value and a reversed pair', () => {
    expect(bubbleSteps([4])[0]).toMatchObject({ phase: 'done', values: [4] })
    const pair = bubbleSteps([2, 1])
    expect(pair.some(frame => frame.phase === 'swap')).toBe(true)
    expect(pair[pair.length - 1].values).toEqual([1, 2])
  })

  it('rejects a negative comparison that would move equal values', () => {
    const frames = bubbleSteps([2, 2, 1])
    const swap = frames.find(frame => frame.phase === 'swap')
    expect(swap.values).toEqual([2, 1, 2])
    expect(frames[frames.length - 1].values).toEqual([1, 2, 2])
  })
})

describe('parseInts', () => {
  it('reads spaces, commas, and Chinese commas', () => {
    expect(parseInts('5 1, 4，2、8')).toEqual({ ok: true, nums: [5, 1, 4, 2, 8] })
    expect(parseInts('-3 0 12').nums).toEqual([-3, 0, 12])
  })

  it('names empty, token, and range failures', () => {
    expect(parseInts('   ').error).toBe('empty')
    expect(parseInts('1 a 2').token).toBe('a')
    expect(parseInts('1 80').error).toBe('range')
    expect(formatError(parseInts('1 a')).zh).toContain('不是整数')
    expect(formatError({ error: 'length' }, { min: 2, max: 10 }).en).toContain('2')
  })
})
