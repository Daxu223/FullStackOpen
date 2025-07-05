import { useParams } from 'react-router-dom'
import userService from '../services/users'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const initializeUsers = async () => {
      try {
        const response = await userService.getAll()
        setUsers(response)
      } catch (error) {
        console.log(error.message)
      }
    }

    initializeUsers()
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const User = () => {
  const id = useParams().id
  const [currentUser, setCurrent] = useState({})

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await userService.getSingle(id)
        setCurrent(response)
      } catch (error) {
        console.log(error.message)
      }
    }

    initializeUser()
  }, [id])

  return (
    <div>
      <h1>{currentUser.name}</h1>
      <h2>added blogs</h2>
      {currentUser.blogs && (
        <ul>
          {currentUser.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
  //<div>{currentUser.blogs.map((blog) => console.log(blog))}</div>
}

export { Users, User }
