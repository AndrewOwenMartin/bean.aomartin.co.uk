import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
const pages = import.meta.glob('/markdown/*.md', { 'query': '?raw', 'import': 'default' })

const usePage = (init) => {
  const [page, setPage] = useState()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    init().then(newPage => {
      setPage(newPage)
      setLoaded(true)
    })
  })

  return {
    page,
    loaded,
  }
}

const Page = (props) => {
  const page = usePage(pages["/markdown/"+props.name])
  return (page.loaded ? <Markdown>{page.page}</Markdown> : <p>Loading {props.name}</p>)
}

function App() {

  const intro = usePage(pages["/markdown/intro-to-sds.md"])


  return (
    <>
      <Page name="intro-to-sds.md" />

    </>
  )
}

export default App
