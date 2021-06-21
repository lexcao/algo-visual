import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

export default ({ code, line }) => (
  <>
    <section className="flex w-full items-center justify-center flex-wrap mb-8"
             style={{ backgroundColor: '#2B2B2B' }}>
      <div className="w-min">
        <SyntaxHighlighter
          customStyle={{ padding: '1em' }}
          language="javascript"
          style={darcula}
          wrapLines={true}
          showLineNumbers={true}
          lineNumberStyle={{ display: 'none' }}
          lineProps={it => {
            // TODO follow code step by step
            // const style = { display: 'block' }
            // if (it === line) {
            //   style.backgroundColor = '#EEE'
            // }
            // return { style }
            return {}
          }}>
          {code}
        </SyntaxHighlighter>
      </div>
    </section>

  </>
)