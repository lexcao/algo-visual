export const WINDOW_CODE = `\
function maxWindow(a, k) {
  let sum = 0
  for (let i = 0; i < k; i++) {
    sum += a[i]
  }
  let best = sum
  let bestAt = 0
  for (let right = k; right < a.length; right++) {
    sum += a[right] - a[right - k]
    if (sum > best) {
      best = sum
      bestAt = right - k + 1
    }
  }
  return best
}
`

export const WINDOW_LINES = Object.freeze({
  seed: 6,
  slide: 9,
  best: 11,
  done: 15
})

export function windowInitial (nums, k) {
  const width = Math.min(k, nums.length)
  return {
    values: nums.slice(),
    left: 0,
    right: width ? width - 1 : -1,
    sum: null,
    best: null,
    bestL: 0,
    phase: 'idle',
    line: -1,
    k
  }
}

export function windowSteps (nums, k) {
  const values = nums.slice()
  const frames = []
  if (k < 1 || k > values.length) return frames
  let sum = 0
  for (let i = 0; i < k; i++) sum += values[i]
  let best = sum
  let bestL = 0
  frames.push({
    values: values.slice(),
    left: 0,
    right: k - 1,
    sum,
    best,
    bestL,
    phase: 'seed',
    line: WINDOW_LINES.seed,
    k
  })
  for (let right = k; right < values.length; right++) {
    const left = right - k + 1
    const dropped = values[left - 1]
    const added = values[right]
    sum += added - dropped
    frames.push({
      values: values.slice(),
      left,
      right,
      sum,
      best,
      bestL,
      dropped,
      added,
      phase: 'slide',
      line: WINDOW_LINES.slide,
      k
    })
    if (sum > best) {
      best = sum
      bestL = left
      frames.push({
        values: values.slice(),
        left,
        right,
        sum,
        best,
        bestL,
        phase: 'best',
        line: WINDOW_LINES.best,
        k
      })
    }
  }
  frames.push({
    values: values.slice(),
    left: bestL,
    right: bestL + k - 1,
    sum: best,
    best,
    bestL,
    phase: 'done',
    line: WINDOW_LINES.done,
    k
  })
  return frames
}

export function describeWindow (frame) {
  if (!frame || frame.phase === 'idle') {
    return {
      zh: '按播放。窗口先罩住前 k 个数，再一格一格向右滑。',
      en: 'Press play. The window covers the first k values, then slides right one cell at a time.'
    }
  }
  const { left, right, sum, best, phase, dropped, added, values } = frame
  if (phase === 'seed') {
    return {
      zh: `前 ${right - left + 1} 个数的和是 ${sum}。这是目前的最大和。`,
      en: `The first ${right - left + 1} values sum to ${sum}. That is the best so far.`
    }
  }
  if (phase === 'slide') {
    return {
      zh: `窗口右移：离开 ${dropped}，进入 ${added}。当前和是 ${sum}，最大和仍是 ${best}。`,
      en: `The window slides: ${dropped} leaves and ${added} enters. The sum is ${sum}. The best is still ${best}.`
    }
  }
  if (phase === 'best') {
    return {
      zh: `和变成 ${sum}，超过之前的最大和。窗口从下标 ${left} 开始。`,
      en: `The sum is now ${sum}, which beats the previous best. The window starts at index ${left}.`
    }
  }
  const slice = values.slice(left, right + 1).join(' ')
  return {
    zh: `结束。最大和是 ${best}，窗口是 ${slice}。`,
    en: `Done. The maximum sum is ${best}, from the window ${slice}.`
  }
}
