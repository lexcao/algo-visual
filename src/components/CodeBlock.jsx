import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

export default ({ code, line }) => (
  <>
    <section className="flex w-full items-center justify-center flex-wrap mb-8"
             style={{ backgroundColor: 'rgb(248, 248, 255)' }}>
      <div className="w-min">
        <SyntaxHighlighter
          customStyle={{ padding: '1em' }}
          language="javascript"
          style={docco}
          wrapLines={true}
          showLineNumbers={true}
          lineNumberStyle={{ display: 'none' }}
          lineProps={it => {
            const style = { display: 'block' }
            if (it === line) {
              style.backgroundColor = '#DDD'
            }
            return { style }
          }}>
          {code}
        </SyntaxHighlighter>
      </div>
    </section>

  </>
)