export const getMid = (l, h) => Math.floor(l + (h - l) / 2)

export const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

export const randomElement = (nums) => nums[random(0, nums.length - 1)]

export const equals = (a, b) => {
  const keyA = Object.keys(a)
  const keyB = Object.keys(b)
  if (keyA.length !== keyB.length) return false

  for (let i = 0; i < keyA.length; i++) {
    if (keyA[i] !== keyB[i]) return false
  }

  for (let i = 0; i < keyA.length; i++) {
    if (a[keyA[i]] !== b[keyB[i]]) return false
  }
  return true
}
