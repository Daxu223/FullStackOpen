import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog: (state, action) => {
      state.push(action.payload)
    },
    setBlogs: (state, action) => {
      return action.payload
    },
    updateBlog: (state, action) => {
      const newBlog = action.payload
      return state.map((oldBlog) =>
        oldBlog.id !== newBlog.id ? oldBlog : newBlog
      )
    },
    removeBlog: (state, action) => {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export default blogSlice.reducer
export const { setBlogs, addBlog, appendBlog, updateBlog, removeBlog } =
  blogSlice.actions

// Thunks are great for async operations, like using services
export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog, user) => {
  return async (dispatch) => {
    try {
      const returnedBlog = await blogService.create(blog)
      // When users sends a blog, it won't add the delete button to that
      // blog. This can be fixed by adding the current user to the new blog
      // When blogs are rendered, it can access the blog.user.username property
      const constructBlog = {
        ...returnedBlog,
        user: user,
      }
      dispatch(appendBlog(constructBlog))
      dispatch(
        showNotification(
          `A new blog called ${constructBlog.title} added!`,
          'success',
          5000
        )
      )
    } catch (error) {
      dispatch(showNotification('Check input fields', 'error', 5000))
    }
  }
}

// The service is aware of the user's current token.
export const likeBlog = (blog, user) => {
  return async (dispatch) => {
    const constructBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    // Server only sends back the ID of the user and we need the whole object
    try {
      const likedBlogWithoutUser = await blogService.update(constructBlog)
      const likedBlogWithUser = { ...likedBlogWithoutUser, user: user }
      dispatch(updateBlog(likedBlogWithUser))
    } catch (error) {
      dispatch(showNotification(error.message, 'error', 5000))
    }
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.deleteItem(id)
      dispatch(removeBlog(id))
    } catch (error) {
      dispatch(showNotification(error.message, 'error', 5000))
    }
  }
}
