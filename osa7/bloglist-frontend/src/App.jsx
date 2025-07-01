import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState({ message: '', type: null })
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef(null)

  // Check if user is logged in before rendering the posts
  // If user is not logged in, set blogs to none
  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => {
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      })
    } else {
      setBlogs([])
    }
  }, [user])

  // Checks, if there is a saved user in local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('blogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'blogUser', JSON.stringify(user)
      )

      // Set user and update state in the App
      blogService.setToken(user.token)
      setUser(user)

    } catch (exception) {
      setMessage({ message: 'Wrong credentials', type: 'error' })
      setTimeout(() => {
        setMessage({ message: '', type: null })
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      const returnedBlog = await blogService.create(blogObject)

      // When users sends a blog, it won't add the delete button to that
      // blog. This can be fixed by adding the current user to the new blog
      // When blogs are rendered, it can access the blog.user.username property
      const updatedBlogWithUser = {
        ...returnedBlog,
        user: user // Use state in the hook
      }

      // Ensure the returned blog has the complete user object
      const updatedBlogs = blogs.concat(updatedBlogWithUser)
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))

      // Show some nice CSS notification to the user
      setMessage({ message: `A new blog called ${blogObject.title} added!`, type: 'success' })

      // Make the notification go away after 5 seconds.
      setTimeout(() => {
        setMessage({ message: '', type: null })
      }, 5000)
    } catch (exception) {
      setMessage({ message: 'Check input fields', type: 'error' })
      setTimeout(() => {
        setMessage({ message: '', type: null })
      }, 5000)
    }
  }

  const blogLiked = async (blogObject) => {
    try {
      const likedBlog = {
        id: blogObject.id,
        title: blogObject.title,
        author: blogObject.author,
        url: blogObject.url,
        likes: blogObject.likes + 1,
        user: blogObject.user.id
      }

      // This does not return the user attributes, only the id of the user
      const updatedBlog = await blogService.update(likedBlog)

      // Take the user from the original request and update the response
      // with the user.
      const updatedBlogWithUser = {
        ...updatedBlog,
        user: blogObject.user
      }

      // If the id of the blog is not the same as the update id
      // Return the original blog. In other words, do not change blogs
      // that IDs are not the same as the updated blog.
      // If the updated blog has an id that matches a previous blog
      // Update it and return the updatedBlog and replace with setBlogs
      const updatedBlogs = blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlogWithUser)
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    } catch (error) {
      console.log('Error liking blog: ', error)
    }
  }

  const blogDeleted = async (id) => {
    try {
      await blogService.deleteItem(id)
      const filteredBlogs = blogs.filter(blog => blog.id !== id)
      setBlogs(filteredBlogs.sort((a, b) => b.likes - a.likes))
    } catch (error) {
      console.log('Error deleting blog: ', error)
    }
  }

  // Password and username state
  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )

  const removeUserFromLocalStorage = () => {
    window.localStorage.removeItem('blogUser')
    setUser(null)
  }

  // Passing the functions to the Blog components because blogs are being managed
  // with the blogs state hook. If they would be defined in the Blog component
  // the component would be needed to be done in a different way.
  // In this case, it is better that the blogs stay this way.
  const userIsLoggedIn = (user) => (
    <div>
      <div>
        {user.name} logged in&nbsp;
        <button onClick={() => removeUserFromLocalStorage()}>
        Logout
        </button>
      </div>
      <br/>

      <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <br/>

      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            onLike={blogLiked}
            onDelete={blogDeleted}
          />
        )}
      </div>
    </div>
  )

  // Add ref in the createBlog to hide it after blog creation
  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message.message} type={message.type} />

      {!user && <LoginForm loginFunction={handleLogin} />}
      {user && userIsLoggedIn(user)}
    </div>
  )
}

export default App