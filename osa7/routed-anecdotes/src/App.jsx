import { useState } from 'react'
import { useField } from './hooks'

import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'

// Using prop drilling here because it is only one-deep.
// Alternative would be to use context but creates complication
const Menu = ({ anecdotes, addNew }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <Router>
      <div>
        <Link style={padding} to="/">anecdotes</Link>
        <Link style={padding} to="/create">create new</Link>
        <Link style={padding} to="/about">about</Link>
      </div>

      <Routes>
        <Route path="*" element={ <AnecdoteList anecdotes={anecdotes} /> } />
        <Route path="/create" element={ <CreateNew addNew={addNew} /> } />
        <Route path="/about" element={ <About /> } />
      </Routes>

    </Router>
  )
}

// Okay so here, if we route to * (everything), we then go here
// Then here, it is checked if we are in the / path or in the anecdotes path
const AnecdoteList = ({ anecdotes }) => {
  const match = useMatch('/anecdotes/:id')
  const anecdote = match 
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null

  return (
    <div>
      <Routes>
        <Route path="/" element={ <Anecdotes anecdotes={anecdotes} /> } />
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
      </Routes>
    </div>
  )
}

const Anecdote = ( {anecdote} ) => {
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a target="_blank" href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const Anecdotes = ({ anecdotes }) => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote =>
          <li key={anecdote.id}>
            <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  // These hooks return type, value, onChange
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/')

    props.addNew({
      content: content.inputFields.value,
      author: author.inputFields.value,
      info: info.inputFields.value,
      votes: 0
    })

  }

  // Spread operator to input gives them type, value, onChange
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.inputFields} />
        </div>
        <div>
          author
          <input {...author.inputFields} />
        </div>
        <div>
          url for more info
          <input {...info.inputFields} />
        </div>
        <button type="submit">create</button>
        <button style={{ "marginLeft": 5 }} type="button" onClick={() => {
          content.reset()
          author.reset()
          info.reset()
          }}
        >reset</button>
      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`a new anecdote ${anecdote.content} created!`)

    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      {notification && <div>{notification}</div>}
      <Menu anecdotes={anecdotes} addNew={addNew} />
      <Footer />
    </div>
  )
}

export default App
