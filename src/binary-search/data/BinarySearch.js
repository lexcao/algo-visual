import { getMid } from '../utils'

const id = 'sorted-array'

const name = 'sorted array'

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
    step_PickMid()
    setStep(2)
  } else if (step === 2) {
    step_MoveCursor()
    setStep(1)
  }

  function step_PickMid () {
    updatePos({ m: getMid(pos.l, pos.h), line: Lines.Assign_M })
  }

  function step_MoveCursor () {
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
  id, name, code, nums, onNextRound
}