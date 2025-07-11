import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      // Invalidate cache from client side, force rerender
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      dispatch({
        type: 'SHOW_NOTIFICATION', 
        payload: {
          message: `anecdote '${newAnecdote.content}' added`
        }
      })

      setTimeout(() => {
        dispatch({ type: 'HIDE_NOTIFICATION' })
      }, 5000)
    },
    onError: () => {
      dispatch({ 
        type: 'SHOW_NOTIFICATION', 
        payload: {
          message: 'too short anecdote, must have length 5 or more'
        } 
      })
            
      setTimeout(() => {
        dispatch({ type: 'HIDE_NOTIFICATION' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
