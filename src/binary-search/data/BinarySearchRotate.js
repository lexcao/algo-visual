import { getMid } from '../utils'

const name = 'binary search rotate'

const Lines = Object.freeze({
  Assign_M: 3,
  Assign_V: 7,
  Update_L: 11,
  Update_H: 13,
  Return_M: 15
})

const code = `\
function binarySearchRotate(nums, l, h, target) {
  while (l <= h) {
    const m = Math.floor(l + (h - l) / 2)
    let value = nums[m]
    
    if ((value >= nums[0]) !== (target >= nums[0]) {
        value = target >= nums[0] ? Number.MAX_VALUE : -Number.MAX_VALUE 
    }
    
    if (value < target) {
      l = m + 1
    } else if (value > target) {
      h = m - 1
    } else {
      return m
    }
  }
  return -1
}`

const nums = [4, 5, 6, 7, 8, 9, 0, 1, 2, 3]

const onNextRound = (pos, updatePos, step, setStep, target) => {

  if (step === 1) {
    step_PickMid()
    setStep(2)
  } else if (step === 2) {
    if ((nums[pos.m] >= nums[0]) !== (target >= nums[0])) {
      updatePos({ line: Lines.Assign_V })
      setStep(3)
    } else {
      step_MoveCursor()
      setStep(1)
    }
  } else if (step === 3) {
    step_MoveCursor()
    setStep(1)
  }

  function step_PickMid () {
    updatePos({ m: getMid(pos.l, pos.h), line: Lines.Assign_M })
  }

  function step_MoveCursor () {
    let value = nums[pos.m]
    if ((value >= nums[0]) !== (target >= nums[0])) {
      value = target >= nums[0] ? Number.MAX_VALUE : -Number.MAX_VALUE
    }
    if (value < target) {
      updatePos({ l: pos.m + 1, line: Lines.Update_L })
    } else if (value > target) {
      updatePos({ h: pos.m - 1, line: Lines.Update_H })
    } else {
      updatePos({ line: Lines.Return_M })
    }
  }
}

export default {
  name, code, nums, onNextRound
}
