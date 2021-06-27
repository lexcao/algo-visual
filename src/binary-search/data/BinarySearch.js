import { getMid } from '../utils'

const name = 'binary search'

const Lines = Object.freeze({
  Assign_M: 3,
  Update_L: 5,
  Update_H: 7,
  Return_M: 9
})

const code = `\
function binarySearch(nums, l, h, target) {
  while (l <= h) {
    const m = Math.floor(l + (h - l) / 2)
    if (nums[m] < target) {
      l = m + 1
    } else if (nums[m] > target) {
      h = m - 1
    } else {
      return m
    }
  }
  return -1
}`

const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const onNextRound = (pos, updatePos, step, setStep, t) => {

  if (step === 1) {
    step1_PickMid()
    setStep(2)
  } else if (step === 2) {
    step2_MoveCursor()
    setStep(1)
  }

  function step1_PickMid () {
    updatePos({ m: getMid(pos.l, pos.h), line: Lines.Assign_M })
  }

  function step2_MoveCursor () {
    if (nums[pos.m] < t) {
      updatePos({ l: pos.m + 1, line: Lines.Update_L })
    } else if (nums[pos.m] > t) {
      updatePos({ h: pos.m - 1, line: Lines.Update_H })
    } else {
      updatePos({ line: Lines.Return_M })
    }
  }
}

export default {
  name, code, nums, onNextRound
}