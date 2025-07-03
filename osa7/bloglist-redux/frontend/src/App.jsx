import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

import { showNotification } from './reducers/notificationReducer'

import {
  initializeBlogs,
  createBlog,
  likeBlog,
  deleteBlog
} from './reducers/blogReducer'

import {
  setUser,
  clearUser
} from './reducers/userReducer'

const App = () => {
  const user = useSelector((state) => state.user)
  const notification = useSelector((state) => state.notification)
  const blogsSelect = useSelector((state) => [...state.blogs].sort((a, b) => b.likes - a.likes))
  const blogFormRef = useRef(null)
  const dispatch = useDispatch()

  // Runs a single time. Sets the user if its in the local storage.
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('blogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  // Initializes blogs using Redux thunks.
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('blogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(showNotification('Wrong credentials', 'error', 5000))
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject, user))
  }

  const blogLiked = async (blogObject) => {
    dispatch(likeBlog(blogObject, user))
  }

  const blogDeleted = async (id) => {
    dispatch(deleteBlog(id))
  }

  const handleLogout = () => {
    window.localStorage.removeItem('blogUser')
    dispatch(clearUser())
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.type} />

      {!user && <LoginForm loginFunction={handleLogin} />}
      {user &&
      <LoggedInView
        user={user}
        blogs={blogsSelect}
        addBlog={addBlog}
        likeBlog={blogLiked}
        deleteBlog={blogDeleted}
        onLogout={handleLogout}
        blogFormRef={blogFormRef}
      />
      }
    </div>
  )
}

const LoggedInView = ({
  user,
  blogs,
  addBlog,
  likeBlog,
  deleteBlog,
  onLogout,
  blogFormRef
}) => {
  return (
    <div>
      <div>
        {user.name} logged in&nbsp;
        <button onClick={() => {onLogout}}>Logout</button>
      </div>
      <br />

      <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            onLike={likeBlog}
            onDelete={deleteBlog}
          />
        ))}
      </div>
    </div>
  )
}

export default App
