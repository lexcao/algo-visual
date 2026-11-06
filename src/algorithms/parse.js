export function parseInts (text) {
  const trimmed = String(text == null ? '' : text).trim()
  if (!trimmed) return { ok: false, error: 'empty' }
  const parts = trimmed.split(/[\s,，、]+/).filter(Boolean)
  const nums = []
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!/^-?\d+$/.test(part)) return { ok: false, error: 'token', token: part }
    const value = Number(part)
    if (!Number.isSafeInteger(value) || value < -50 || value > 50) {
      return { ok: false, error: 'range', token: part }
    }
    nums.push(value)
  }
  return { ok: true, nums }
}

export function lengthError (nums, min, max) {
  if (nums.length < min || nums.length > max) return { ok: false, error: 'length', min, max }
  return { ok: true, nums }
}

export function formatError (error, bounds) {
  const min = bounds && bounds.min != null ? bounds.min : 2
  const max = bounds && bounds.max != null ? bounds.max : 10
  if (!error) return null
  if (error.error === 'empty') {
    return {
      zh: '先输入整数，用空格或逗号分开。',
      en: 'Enter integers separated by spaces or commas.'
    }
  }
  if (error.error === 'token') {
    return {
      zh: `「${error.token}」不是整数。`,
      en: `“${error.token}” is not an integer.`
    }
  }
  if (error.error === 'range') {
    return {
      zh: '每个数请落在 -50 到 50。',
      en: 'Each value must be from -50 to 50.'
    }
  }
  if (error.error === 'length') {
    return {
      zh: `请输入 ${min} 到 ${max} 个整数。`,
      en: `Enter ${min} to ${max} integers.`
    }
  }
  if (error.error === 'unsorted') {
    return {
      zh: '双指针要求从左到右不下降。点「排成升序」再应用。',
      en: 'Two pointers needs a non-decreasing sequence. Press Sort ascending, then apply.'
    }
  }
  if (error.error === 'k') {
    return {
      zh: 'k 要是 1 到序列长度之间的整数。',
      en: 'k must be an integer from 1 to the length of the sequence.'
    }
  }
  return {
    zh: '这个输入不能演示。',
    en: 'This input cannot run.'
  }
}
