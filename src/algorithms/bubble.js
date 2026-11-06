export const BUBBLE_CODE = `\
function bubbleSort(a) {
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        const t = a[j]
        a[j] = a[j + 1]
        a[j + 1] = t
        swapped = true
      }
    }
    if (!swapped) return
  }
}
`

export const BUBBLE_LINES = Object.freeze({
  compare: 5,
  swap: 7,
  pass: 4,
  done: 12
})

function range (sortedFrom) {
  if (sortedFrom <= 0) return { lo: -1, hi: -1 }
  return { lo: 0, hi: sortedFrom - 1 }
}

function snapshot (values, ids, extra) {
  const span = range(extra.sortedFrom)
  return {
    values: values.slice(),
    ids: ids.slice(),
    hot: extra.hot,
    phase: extra.phase,
    j: extra.j,
    sortedFrom: extra.sortedFrom,
    lo: span.lo,
    hi: span.hi,
    line: extra.line
  }
}

export function bubbleInitial (nums) {
  return snapshot(nums, nums.map((_, index) => index), {
    phase: 'idle',
    j: -1,
    sortedFrom: nums.length,
    hot: [],
    line: -1
  })
}

export function bubbleSteps (input) {
  const values = input.slice()
  const ids = input.map((_, index) => index)
  const n = values.length
  const frames = []

  if (n < 2) {
    frames.push(snapshot(values, ids, {
      phase: 'done',
      j: -1,
      sortedFrom: 0,
      hot: [],
      line: BUBBLE_LINES.done
    }))
    return frames
  }

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    const sortedFrom = n - i
    for (let j = 0; j < n - 1 - i; j++) {
      frames.push(snapshot(values, ids, {
        phase: 'compare',
        j,
        sortedFrom,
        hot: [j, j + 1],
        line: BUBBLE_LINES.compare
      }))
      if (values[j] > values[j + 1]) {
        const value = values[j]
        values[j] = values[j + 1]
        values[j + 1] = value
        const id = ids[j]
        ids[j] = ids[j + 1]
        ids[j + 1] = id
        swapped = true
        frames.push(snapshot(values, ids, {
          phase: 'swap',
          j,
          sortedFrom,
          hot: [j, j + 1],
          line: BUBBLE_LINES.swap
        }))
      }
    }
    const settled = n - 1 - i
    const lastPass = i === n - 2
    if (!swapped || lastPass) {
      frames.push(snapshot(values, ids, {
        phase: 'done',
        j: -1,
        sortedFrom: 0,
        hot: [],
        line: BUBBLE_LINES.done
      }))
      break
    }
    frames.push(snapshot(values, ids, {
      phase: 'pass',
      j: -1,
      sortedFrom: settled,
      hot: [],
      line: BUBBLE_LINES.pass
    }))
  }

  return frames
}

export function describeBubble (frame) {
  if (!frame || frame.phase === 'idle') {
    return {
      zh: '按播放，从左到右比较相邻的两个数。',
      en: 'Press play to compare adjacent values from left to right.'
    }
  }
  const { values, j, phase, sortedFrom } = frame
  if (phase === 'compare') {
    const left = values[j]
    const right = values[j + 1]
    const order = left > right ? '左边更大，下一步交换。' : '顺序已经对，不交换。'
    const orderEn = left > right
      ? 'The left value is larger, so the next step swaps them.'
      : 'They are already in order, so they stay.'
    return {
      zh: `比较 ${left} 和 ${right}。${order}`,
      en: `Compare ${left} and ${right}. ${orderEn}`
    }
  }
  if (phase === 'swap') {
    return {
      zh: `已经交换。这一对现在是 ${values[j]}，${values[j + 1]}。`,
      en: `Swapped. The pair is now ${values[j]}, ${values[j + 1]}.`
    }
  }
  if (phase === 'pass') {
    const settled = values[sortedFrom]
    return {
      zh: `这一趟结束。${settled} 落到下标 ${sortedFrom}，不再参加后面的比较。`,
      en: `The pass is over. ${settled} lands at index ${sortedFrom} and stays out of later comparisons.`
    }
  }
  return {
    zh: `排序完成：${values.join(' ')}。`,
    en: `Sorted: ${values.join(' ')}.`
  }
}
