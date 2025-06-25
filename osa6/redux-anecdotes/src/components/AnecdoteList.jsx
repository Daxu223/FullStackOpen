import { useDispatch, useSelector } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { showNotification, hideNotification } from "../reducers/notificationReducer"
import { useRef } from 'react'
import PropTypes from 'prop-types'

// WARNING: Lots of comments, this is for learning purposes
const Anecdote = ({ content, votes, handleClick }) => {
    return (
    <div>
      <div>
        {content}
      </div>
    
      <div>
        has {votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
    )
}

Anecdote.propTypes = {
    content: PropTypes.string,
    votes: PropTypes.number,
    handleClick: PropTypes.func
}

const AnecdoteList = () => {
  // Return anecdotes and filter states with destructuring
  // Alternative would be to get the states invidually like
  // const anecdotesDeclaration = useSelector(state => state.anecdotes)
  const { anecdotes, filter } = useSelector(state => state)

  // sort rerenders / sorts, when state is changed because
  // useSelector rerenders based on state changes.
  
  // Optionally, this could be implemented in the voting logic
  // Which could be more optimal. The app works either way and causes
  // no performance issues.
  
  // Another thing: sort mutates the original state
  // and breaks Redux principles, so a copy is created with spread.
  const filteredAnecdotes = [...anecdotes]
    .sort((a, b) => {
      return b.votes - a.votes
    })
    .filter(anecdote => {
      return anecdote.content.toLowerCase().startsWith(filter.toLowerCase())
    }
  )

  const dispatch = useDispatch()

  // This is used clearing timeout if there is a timeout going on
  const timeoutRef = useRef(null)

  // Show message for a certain duration, duration is in milliseconds
  const voteAndDisplayNotification = (id, message) => {
    // Clear timeout if there is a message shown already
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Vote and show notification. Dispatches them to reducers.
    dispatch(voteAnecdote(id))
    dispatch(showNotification(message))

    // Display the notification for a duration of milliseconds (5000 = 5 secs)
    timeoutRef.current = setTimeout(() => {
      dispatch(hideNotification())
      timeoutRef.current = null
    }, 5000)
  }

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <Anecdote 
          key={anecdote.id}
          content={anecdote.content}
          votes={anecdote.votes}
          handleClick={() => voteAndDisplayNotification(anecdote.id, `You voted '${anecdote.content}'`)}
        />
      )}
    </div>
  )
}

export default AnecdoteList