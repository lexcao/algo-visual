const IDLE = {
  zh: '点数组里的一个数，把它设为目标。不选的话，开始时会随机挑一个。',
  en: 'Click a value to set the target. Starting without one picks a value at random.'
}

export function describeStep (variant, curr, target) {
  if (!variant || !curr || curr.l < 0) {
    if (target >= 0) {
      return {
        zh: `目标是 ${target}。按开始，从整段数组搜起。`,
        en: `Target is ${target}. Press start to search the whole array.`
      }
    }
    return IDLE
  }
  if (target < 0) return IDLE

  const { nums, roles } = variant
  const { l, h, m, line } = curr

  if (line === roles.found) {
    return {
      zh: `找到了。目标 ${target} 在下标 ${m}。`,
      en: `Found. Target ${target} is at index ${m}.`
    }
  }

  if (line === roles.pick && m >= 0) {
    const value = nums[m]
    return {
      zh: `取中点 m = ${m}，值 ${value}，目标 ${target}。`,
      en: `Midpoint m = ${m}, value ${value}, target ${target}.`
    }
  }

  if (line === roles.low) {
    return {
      zh: `中点小于目标 ${target}，丢掉左半，左界 l 移到 ${l}。`,
      en: `The midpoint is below target ${target}. The left half is discarded and low moves to ${l}.`
    }
  }

  if (line === roles.high) {
    return {
      zh: `中点大于目标 ${target}，丢掉右半，右界 h 移到 ${h}。`,
      en: `The midpoint is above target ${target}. The right half is discarded and high moves to ${h}.`
    }
  }

  if (roles.jumpLow && line === roles.jumpLow) {
    return {
      zh: `左端是一段重复的 ${nums[l]}，左界跳到 ${l}。`,
      en: `The left end is a run of ${nums[l]}. Low jumps to ${l}.`
    }
  }

  if (roles.jumpHigh && line === roles.jumpHigh) {
    return {
      zh: `右端是一段重复的 ${nums[h]}，右界跳到 ${h}。`,
      en: `The right end is a run of ${nums[h]}. High jumps to ${h}.`
    }
  }

  if (roles.map && line === roles.map) {
    return {
      zh: `中点 ${nums[m]} 和目标 ${target} 不在旋转的同一侧，先把中点映到极值，再比较。`,
      en: `Midpoint ${nums[m]} and target ${target} sit on different sides of the rotation, so the midpoint is mapped to an extreme before the comparison.`
    }
  }

  if (line < 0) {
    return {
      zh: `搜索范围是 l = ${l} 到 h = ${h}。下一步取中点。`,
      en: `The range runs from l = ${l} to h = ${h}. The next step takes the midpoint.`
    }
  }

  return {
    zh: `l = ${l}，h = ${h}，目标 ${target}。`,
    en: `l = ${l}, h = ${h}, target ${target}.`
  }
}
