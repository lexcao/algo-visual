import { getMid } from '../utils'

const id = 'sorted-array-with-duplicate'

const name = 'sorted array with duplicate'

const Lines = Object.freeze({
  Jump_L: 3,
  Jump_H: 4,
  Assign_M: 5,
  Update_L: 7,
  Update_H: 9,
  Return_M: 11
})

const code = `\
function binarySearchDuplicate(nums, l, h, target) {
  while (l <= h) {
    while (l < h && nums[l] === nums[l + 1]) { l++ }
    while (l < h && nums[h] === nums[h - 1]) { h-- }
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

// const nums = [1, 2, 2, 2, 2, 2, 3, 4, 5]
const nums = [1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 5]

const onNextRound = (pos, updatePos, step, setStep, t) => {

  if (pos.l < pos.h && nums[pos.l] === nums[pos.l + 1]) {
    step = 3
  }
  if (pos.l < pos.h && nums[pos.h] === nums[pos.h - 1]) {
    step = 4
  }

  if (step === 3) {
    step_jumpLeftDuplicate()
    setStep(1)
  } else if (step === 4) {
    step_jumpRightDuplicate()
    setStep(1)
  }

  if (step === 1) {
    step_PickMid()
    setStep(2)
  } else if (step === 2) {
    step_MoveCursor()
    setStep(1)
  }

  function step_jumpLeftDuplicate () {
    let l = pos.l, h = pos.h
    while (l < h && nums[l] === nums[l + 1]) {
      l++
    }
    if (l !== pos.l) {
      updatePos({ l: l, line: Lines.Jump_L })
    }
  }

  function step_jumpRightDuplicate () {
    let l = pos.l, h = pos.h
    while (l < h && nums[h] === nums[h - 1]) {
      h--
    }
    if (h !== pos.h) {
      updatePos({ h: h, line: Lines.Jump_H })
    }
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