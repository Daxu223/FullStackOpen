import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const newObject = { content, votes: 0 }
  const response = await axios.post(baseUrl, newObject)  
  return response.data 
}

const vote = async (id) => {
  const anecdotes = await axios.get(`${baseUrl}/`)
  const findCorrectAnecdote = anecdotes.data.find(anecdote => anecdote.id === id) 
  
  const votedObject = {
    ...findCorrectAnecdote,
    votes: findCorrectAnecdote.votes + 1
  }

  const updatedAnecdote = await axios.put(`${baseUrl}/${id}`, votedObject)
  return updatedAnecdote.data
}

export default { getAll, createNew, vote }