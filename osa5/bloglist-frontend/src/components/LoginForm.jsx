import { useState } from 'react'

const LoginForm = ({ loginFunction }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // To lift state up, we need a function from the App.jsx
  const formHandler = (event) => {
    event.preventDefault()
    loginFunction(username, password)

    // Reset forms
    setPassword('')
    setUsername('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={formHandler}>
        <div>
            username
          <input
            type="text"
            value={username}
            data-testid="username"
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
            password
          <input
            type="password"
            value={password}
            data-testid="password"
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm