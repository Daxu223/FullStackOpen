import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { showNotification, hideNotification } from "../reducers/notificationReducer"
import { useRef } from "react"

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const timeoutRef = useRef(null)

  const addAnecdote = (e) => {
    if (timeoutRef.current) {
      clearTimeout()
    }

    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(showNotification(`Anecdote '${content}' created`))

    timeoutRef.current = setTimeout(() => {
      dispatch(hideNotification())
      timeoutRef.current = null
    }, 5000)

  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm