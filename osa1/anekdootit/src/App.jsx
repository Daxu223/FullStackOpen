import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)

  // Sets the votes to anecdote (key) and setVotes: 0 (value)
  // Accumulator is the object, which gets filled with key-value pairs.
  const [votes, setVotes] = useState(
    anecdotes.reduce((accumulator, anecdote) => {
      const selected = anecdote
      accumulator[selected] = 0
      return accumulator
    }, {})
  )
  const selectRandomAnecdote = () => {
    const randomAnecdoteIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomAnecdoteIndex)
  }

  // In this function we copy the original hook state, create a copy -> manipulate copy -> set state with the copy
  // Do not manipulate the original state directly!
  const voteForAnecdote = () => {
    // Use the spread operator to create a copy
    const copiedVotes = { ...votes } 
    
    // Update the vote count for the selected anecdotes, which is the key
    copiedVotes[anecdotes[selected]] += 1

    // Set state with the updated copy
    setVotes(copiedVotes) 
  }

  // TODO: Refactor to anecdotes and use them instead
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[anecdotes[selected]]} votes</div>
      <button onClick={voteForAnecdote}>vote</button>
      <button onClick={selectRandomAnecdote}>next anecdote</button>
      <MostVotesAnecdote votes={votes} />
    </div>
  )
}


const MostVotesAnecdote = ({votes}) => {
  const mostVotes = Object.keys(votes).reduce(function(a, b){ return votes[a] > votes[b] ? a : b });
  const votesForAnecdote = votes[mostVotes]

  return (
    <div>
      <h1>Most voted anecdote</h1>
      <div>{mostVotes}</div>
      <div>has {votesForAnecdote}  votes</div>
    </div>
  )
}

export default App