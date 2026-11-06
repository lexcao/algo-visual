export const QUICK_CODE = `\
function quickSort(a, lo, hi) {
  if (lo >= hi) return
  const pivot = a[hi]
  let i = lo
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      const t = a[i]
      a[i] = a[j]
      a[j] = t
      i++
    }
  }
  const t = a[i]
  a[i] = a[hi]
  a[hi] = t
  quickSort(a, lo, i - 1)
  quickSort(a, i + 1, hi)
}
`

export const QUICK_LINES = Object.freeze({
  base: 2,
  pivot: 3,
  compare: 6,
  swap: 8,
  place: 14
})

function addMark (marks, index, label) {
  if (index < 0) return
  if (!marks[index]) marks[index] = []
  if (marks[index].indexOf(label) === -1) marks[index].push(label)
}

function marksFor (i, j, pivot) {
  const marks = {}
  addMark(marks, i, 'i')
  addMark(marks, j, 'j')
  addMark(marks, pivot, '枢')
  return marks
}

export function quickInitial (nums) {
  const n = nums.length
  return {
    values: nums.slice(),
    ids: nums.map((_, index) => index),
    hot: [],
    marks: {},
    lo: n ? 0 : -1,
    hi: n ? n - 1 : -1,
    phase: 'idle',
    line: -1
  }
}

export function quickSteps (input) {
  const values = input.slice()
  const ids = input.map((_, index) => index)
  const frames = []
  const n = values.length

  function snap (extra) {
    frames.push({
      values: values.slice(),
      ids: ids.slice(),
      hot: extra.hot,
      marks: extra.marks,
      lo: extra.lo,
      hi: extra.hi,
      phase: extra.phase,
      line: extra.line
    })
  }

  function swapAt (i, j) {
    if (i === j) return
    const value = values[i]
    values[i] = values[j]
    values[j] = value
    const id = ids[i]
    ids[i] = ids[j]
    ids[j] = id
  }

  function sort (lo, hi) {
    if (lo > hi) return
    if (lo === hi) {
      snap({
        phase: 'base',
        lo,
        hi,
        hot: [lo],
        marks: marksFor(-1, -1, lo),
        line: QUICK_LINES.base
      })
      return
    }
    snap({
      phase: 'pivot',
      lo,
      hi,
      hot: [hi],
      marks: marksFor(lo, -1, hi),
      line: QUICK_LINES.pivot
    })
    let i = lo
    for (let j = lo; j < hi; j++) {
      const pivot = values[hi]
      snap({
        phase: 'compare',
        lo,
        hi,
        hot: [j, hi],
        marks: marksFor(i, j, hi),
        line: QUICK_LINES.compare
      })
      if (values[j] < pivot) {
        if (i !== j) {
          swapAt(i, j)
          snap({
            phase: 'swap',
            lo,
            hi,
            hot: [i, j, hi],
            marks: marksFor(i, j, hi),
            line: QUICK_LINES.swap
          })
        }
        i += 1
      }
    }
    swapAt(i, hi)
    snap({
      phase: 'place',
      lo,
      hi,
      hot: [i],
      marks: marksFor(-1, -1, i),
      line: QUICK_LINES.place
    })
    sort(lo, i - 1)
    sort(i + 1, hi)
  }

  if (n === 0) return frames
  sort(0, n - 1)
  snap({
    phase: 'done',
    lo: -1,
    hi: -1,
    hot: [],
    marks: {},
    line: QUICK_LINES.base
  })
  return frames
}

export function describeQuick (frame) {
  if (!frame || frame.phase === 'idle') {
    return {
      zh: '按播放。每一段取最右边的数当枢轴，比它小的换到左边。',
      en: 'Press play. Each range takes its rightmost value as the pivot and swaps smaller values to the left.'
    }
  }
  const { values, phase, lo, hi, marks } = frame
  const pivotAt = Object.keys(marks).map(Number).find(index => marks[index].indexOf('枢') !== -1)
  if (phase === 'pivot') {
    return {
      zh: `看下标 ${lo} 到 ${hi}。枢轴是最右边的 ${values[hi]}。`,
      en: `The range is ${lo} through ${hi}. The pivot is the rightmost value, ${values[hi]}.`
    }
  }
  if (phase === 'compare') {
    const j = Object.keys(marks).map(Number).find(index => marks[index].indexOf('j') !== -1)
    const cursor = values[j]
    const pivot = values[hi]
    const verdict = cursor < pivot ? '它更小，要换到左边。' : '它不比枢轴小，留在右边。'
    const verdictEn = cursor < pivot
      ? 'It is smaller, so it moves to the left side.'
      : 'It is not smaller than the pivot, so it stays on the right.'
    return {
      zh: `比较 ${cursor} 和枢轴 ${pivot}。${verdict}`,
      en: `Compare ${cursor} with pivot ${pivot}. ${verdictEn}`
    }
  }
  if (phase === 'swap') {
    return {
      zh: '比枢轴小的数已经换到 i 的位置。',
      en: 'The smaller value has swapped into i.'
    }
  }
  if (phase === 'place') {
    const at = pivotAt == null ? hi : pivotAt
    return {
      zh: `枢轴 ${values[at]} 落到下标 ${at}，这就是它的最终位置。`,
      en: `Pivot ${values[at]} lands at index ${at}. That index is final.`
    }
  }
  if (phase === 'base') {
    return {
      zh: `下标 ${lo} 只剩 ${values[lo]}，不用再划分。`,
      en: `Index ${lo} holds only ${values[lo]}, so this range is finished.`
    }
  }
  return {
    zh: `排序完成：${values.join(' ')}。`,
    en: `Sorted: ${values.join(' ')}.`
  }
}
