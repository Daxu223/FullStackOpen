import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

// Convert textual notes to have id and votes in the initial state
const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      state.push({
        content,
        votes: 0,
        id: getId()
      })
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteById = state.find(stateAnecdote => stateAnecdote.id === id)
      const votedAnecdote = {
        ...anecdoteById,
        votes: anecdoteById.votes + 1
      }

      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : votedAnecdote
      )
    }
  }
})

/*const reducer = (state = initialState, action) => {
  // console.log('state now: ', state)
  // console.log('action', action)

  switch(action.type) {
    case 'VOTE': {
      const givenId = action.payload.id
      const anecdote = state.find(stateAnecdote => stateAnecdote.id === givenId)
      const votedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }

      return state.map(anecdote => 
        anecdote.id !== givenId ? anecdote : votedAnecdote 
      )
    }

    // Concat creates a new list and does not mutate the state directly
    case 'NEW_ANECDOTE': {
      return state.concat(action.payload)
    }
  }

  return state

}

const createAnecdote = (content) => {
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content: content,
      id: Number((Math.random() * 1234567).toFixed(0)),
      votes: 0
    }
  }
}

const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    payload: { id }
  }
}*/

export const { createAnecdote, voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer