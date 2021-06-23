import { CellType } from './constans'

export const ofCellType = (i, l, m, h, t) => {
  const types = [CellType.Empty]

  if (i === l) {
    types.push(CellType.Low)
  }

  if (i === m) {
    types.push(CellType.Mid)
  }

  if (i === h) {
    types.push(CellType.High)
  }

  if (i === t) {
    types.push(CellType.Target)
  }

  if (types.length > 1) {
    // remove Empty
    types.shift()
  }

  return types
}
