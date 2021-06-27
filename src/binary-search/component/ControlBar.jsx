import React from 'react'

export default ({ target, found, running, onClickReset, onClickNext }) => {
  return <section className="flex justify-center my-8">
    <div className="flex justify-between w-10/12 items-center">
      <span
        className="text-gray-900 font-medium text-2xl">
        {running ? 'Reset to change' : 'Click'} target >> {target}
      </span>
      {found && <span className="font-medium text-2xl">🎉 Found at {found}</span>}
      <div className="flex justify-end">
        <a onClick={onClickReset} className="cursor-pointer text-gray-700 inline-flex items-center uppercase">reset</a>
        <button
          onClick={onClickNext}
          className="text-white w-36 bg-indigo-500 py-2 px-4 ml-4 hover:bg-indigo-600 rounded text-lg">{!running ? 'Start' : 'Next Step'}
        </button>
      </div>
    </div>
  </section>
}