import React from 'react'

const TOKEN = /\/\/.*|\b(?:function|const|let|if|else|while|return)\b|\b(?:Math|Number)\b|\b\d+\b/g

function tokenize (line) {
  const parts = []
  let last = 0
  TOKEN.lastIndex = 0
  let match = TOKEN.exec(line)
  while (match) {
    if (match.index > last) parts.push({ kind: 'plain', text: line.slice(last, match.index) })
    const text = match[0]
    let kind = 'plain'
    if (/^(?:function|const|let|if|else|while|return)$/.test(text)) kind = 'key'
    else if (/^(?:Math|Number)$/.test(text)) kind = 'fn'
    else if (/^\d/.test(text)) kind = 'num'
    parts.push({ kind, text })
    last = match.index + text.length
    match = TOKEN.exec(line)
  }
  if (last < line.length) parts.push({ kind: 'plain', text: line.slice(last) })
  if (!parts.length) parts.push({ kind: 'plain', text: '' })
  return parts
}

export default function CodeBlock ({ code, line }) {
  const lines = code.replace(/\n$/, '').split('\n')
  return (
    <section className="code-section" aria-labelledby="code-heading">
      <h2 id="code-heading" className="section-title">代码 <span lang="en">Code</span></h2>
      <pre className="code" aria-label="当前算法的代码，当前行已标出">
        <code>
          {lines.map((text, index) => {
            const number = index + 1
            return (
              <span key={number} className={number === line ? 'line is-current' : 'line'}>
                <span className="ln">{number}</span>
                <span className="src">
                  {tokenize(text).map((part, i) => (
                    <span key={i} className={part.kind === 'plain' ? undefined : `tok tok-${part.kind}`}>{part.text || ' '}</span>
                  ))}
                </span>
              </span>
            )
          })}
        </code>
      </pre>
    </section>
  )
}
