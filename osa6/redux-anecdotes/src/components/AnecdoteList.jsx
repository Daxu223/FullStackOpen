import { useDispatch, useSelector } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import PropTypes from 'prop-types'

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
  // Gets all states from the store, which only contains anecdotes
  // In a more complex app, could be state => state.anecdotes
  const anecdotes = useSelector(state => 
    // sort rerenders / sorts, when state is changed because
    // useSelector rerenders based on state changes.

    // Optionally, this could be implemented in the voting logic
    // Which could be more optimal. The app works either way and causes
    // no performance issues.
    
    // Another thing: sort mutates the original state
    // and breaks Redux principles, so a copy is created with spread.
    [...state].sort((a, b) => {
      const votesA = a.votes
      const votesB = b.votes

      if (votesA > votesB) {
        return -1
      }
      if (votesA < votesB) {
        return 1;
      }

      return 0;
    })
  )

  const dispatch = useDispatch()

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote 
          key={anecdote.id}
          content={anecdote.content}
          votes={anecdote.votes}
          handleClick={() =>
            dispatch(voteAnecdote(anecdote.id))
          }
        />
      )}
    </div>
  )
}

export default AnecdoteList