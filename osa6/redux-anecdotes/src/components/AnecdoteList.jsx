import { useDispatch, useSelector } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"
import PropTypes from 'prop-types'

// WARNING: Lots of comments, this is for learning purposes
const Anecdote = ({ anecdote, handleClick }) => {
    return (
    <div>
      <div>
        {anecdote.content}
      </div>
    
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
    )
}

Anecdote.propTypes = {
    anecdote: PropTypes.object,
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

  // Dispatch to action creators, which then changes store state.
  const dispatch = useDispatch()

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <Anecdote 
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(setNotification(`You voted '${anecdote.content}'`, 5000))
            dispatch(voteAnecdote(anecdote.id))
          }}
        />
      )}
    </div>
  )
}

export default AnecdoteList