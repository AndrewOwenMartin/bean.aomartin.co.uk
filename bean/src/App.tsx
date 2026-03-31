import { useState } from 'react'
import Markdown from 'react-markdown'
import introMd from '/intro.md?raw'
import exampleMd from '/markdown-example.md?raw'

function App() {

  const md = '# Hi, *Pluto*!'


  return (
    <>
      <h1>Hello world</h1>
      <section>
      <h2>Content</h2>
      <p>I'm going to try to write an intro to SDS.</p>
      <Markdown>{introMd}</Markdown>
      </section>
      {/*<Markdown>{exampleMd}</Markdown>*/}

    </>
  )
}

export default App
