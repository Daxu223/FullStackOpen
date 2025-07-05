import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch,
  Navigate,
} from 'react-router-dom'

import { User, Users } from './components/UsersView'
import { Blog, BlogDetails } from './components/BlogView'
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
  deleteBlog,
  updateBlog,
} from './reducers/blogReducer'

import { setUser, clearUser } from './reducers/userReducer'

const App = () => {
  const user = useSelector((state) => state.user)
  const notification = useSelector((state) => state.notification)
  const blogsSelect = useSelector((state) =>
    [...state.blogs].sort((a, b) => b.likes - a.likes)
  )
  const blogFormRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

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
      navigate('/blogs')
    } catch (error) {
      console.log(error.message)
      if (error.message.includes('500')) {
        dispatch(showNotification('Could not connect to server', 'error', 5000))
      } else {
        dispatch(showNotification('Wrong credentials', 'error', 5000))
      }
    }
  }

  const handleLogout = () => {
    navigate('/')
    window.localStorage.removeItem('blogUser')
    dispatch(clearUser())
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject, user))
  }

  const blogLiked = async (blogObject) => {
    dispatch(likeBlog(blogObject, user))
  }

  const blogCommented = async (blogId, comment) => {
    try {
      const updated = await blogService.createComment(blogId, comment)
      dispatch(updateBlog(updated))
      dispatch(showNotification('Added comment!', 'success', 5000))
    } catch (error) {
      dispatch(showNotification('Error adding comment', 'error', 5000))
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogsSelect.find((blog) => blog.id === String(match.params.id))
    : null

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <TopView user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/blogs"
          element={
            <Blogs
              user={user}
              blogs={blogsSelect}
              blogFormRef={blogFormRef}
              addBlog={addBlog}
            />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            user ? (
              <BlogDetails
                blog={blog}
                onLike={blogLiked}
                onComment={blogCommented}
              />
            ) : (
              <Navigate replace to="/" />
            )
          }
        />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/" />}
        />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  )
}

const TopView = ({ user, onLogin, onLogout }) => {
  const navigationStyle = { marginRight: '0.4em' }

  if (!user) {
    return <LoginForm loginFunction={onLogin} />
  }

  return (
    <div style={{ padding: 5, backgroundColor: 'lightGrey' }}>
      <span>
        <Link style={navigationStyle} to="/blogs">
          blogs
        </Link>
        <Link style={navigationStyle} to="/users">
          users
        </Link>
      </span>

      <span style={{ margin: '0 0.5em 0 0.3em' }}>{user.name} logged in</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}

const Blogs = ({ user, blogs, blogFormRef, addBlog }) => {
  if (!user) {
    return null
  }

  return (
    <div>
      <br />

      <div style={{ marginBottom: '1em' }}>
        <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>

      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default App
