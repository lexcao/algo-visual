export const Binary_Search = `\
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

export const Binary_Search_With_Duplicates = ``
export const Binary_Search_In_Rotated = ``
export const Binary_Search_With_Duplicates_In_Rotated = ``
