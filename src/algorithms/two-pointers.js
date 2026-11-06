export const TWO_POINTERS_CODE = `\
function twoSum(a, target) {
  let l = 0
  let r = a.length - 1
  while (l < r) {
    const sum = a[l] + a[r]
    if (sum === target) return [l, r]
    if (sum < target) l++
    else r--
  }
  return [-1, -1]
}
`

export const TWO_POINTERS_LINES = Object.freeze({
  sum: 5,
  found: 6,
  left: 7,
  right: 8,
  miss: 10
})

export function isNonDecreasing (nums) {
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < nums[i - 1]) return false
  }
  return true
}

export function twoPointerInitial (nums) {
  const n = nums.length
  return {
    values: nums.slice(),
    l: 0,
    r: n ? n - 1 : -1,
    sum: null,
    phase: 'idle',
    line: -1,
    found: false
  }
}

export function twoPointerSteps (nums, target) {
  const values = nums.slice()
  const frames = []
  const n = values.length
  if (n < 2) {
    frames.push({
      values,
      l: 0,
      r: n - 1,
      sum: null,
      phase: 'miss',
      line: TWO_POINTERS_LINES.miss,
      found: false,
      target
    })
    return frames
  }
  let l = 0
  let r = n - 1
  while (l < r) {
    const sum = values[l] + values[r]
    frames.push({
      values: values.slice(),
      l,
      r,
      sum,
      phase: 'sum',
      line: TWO_POINTERS_LINES.sum,
      found: false,
      target
    })
    if (sum === target) {
      frames.push({
        values: values.slice(),
        l,
        r,
        sum,
        phase: 'found',
        line: TWO_POINTERS_LINES.found,
        found: true,
        target
      })
      return frames
    }
    if (sum < target) {
      l += 1
      frames.push({
        values: values.slice(),
        l,
        r,
        sum,
        phase: 'left',
        line: TWO_POINTERS_LINES.left,
        found: false,
        target
      })
    } else {
      r -= 1
      frames.push({
        values: values.slice(),
        l,
        r,
        sum,
        phase: 'right',
        line: TWO_POINTERS_LINES.right,
        found: false,
        target
      })
    }
  }
  frames.push({
    values: values.slice(),
    l,
    r,
    sum: null,
    phase: 'miss',
    line: TWO_POINTERS_LINES.miss,
    found: false,
    target
  })
  return frames
}

export function describeTwoPointers (frame) {
  if (!frame || frame.phase === 'idle') {
    return {
      zh: '按播放。左指针从最小的数开始，右指针从最大的数开始。',
      en: 'Press play. The left pointer starts at the smallest value and the right pointer at the largest.'
    }
  }
  const { values, l, r, sum, phase, target } = frame
  if (phase === 'sum') {
    return {
      zh: `${values[l]} + ${values[r]} = ${sum}，目标是 ${target}。`,
      en: `${values[l]} + ${values[r]} = ${sum}. The target is ${target}.`
    }
  }
  if (phase === 'found') {
    return {
      zh: `找到了。下标 ${l} 和 ${r} 的 ${values[l]} 与 ${values[r]} 相加等于 ${target}。`,
      en: `Found. Indexes ${l} and ${r}, ${values[l]} and ${values[r]}, add up to ${target}.`
    }
  }
  if (phase === 'left') {
    return {
      zh: `和 ${sum} 小于目标，左指针右移到 ${values[l]}。`,
      en: `The sum ${sum} is below the target, so the left pointer moves right to ${values[l]}.`
    }
  }
  if (phase === 'right') {
    return {
      zh: `和 ${sum} 大于目标，右指针左移到 ${values[r]}。`,
      en: `The sum ${sum} is above the target, so the right pointer moves left to ${values[r]}.`
    }
  }
  return {
    zh: '左右指针相遇，没有这样一对。',
    en: 'The pointers met. No pair adds up to the target.'
  }
}
