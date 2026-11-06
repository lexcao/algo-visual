import React from 'react'

export default function Editor ({
  label,
  labelEn,
  value,
  onChange,
  onSubmit,
  error,
  children
}) {
  const errorId = error ? 'input-error' : undefined
  return (
    <form className="editor" onSubmit={onSubmit}>
      <label className="field">
        <span className="field-k">{label} <span lang="en">{labelEn}</span></span>
        <input
          value={value}
          onChange={event => onChange(event.target.value)}
          autoComplete="off"
          spellCheck="false"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
        />
      </label>
      {children}
      <button type="submit" className="btn btn-ghost">应用</button>
      {error ? (
        <p className="field-error" id={errorId} role="alert">
          {error.zh}
          <span lang="en">{error.en}</span>
        </p>
      ) : null}
    </form>
  )
}
