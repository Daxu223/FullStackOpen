import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blog, setBlog] = useState(
    {
      author: '',
      title: '',
      url: ''
    }
  )

  // Uses the functionality of blog adding defined in App.jsx
  // This only handles the form operation:
  // resetting the form, using function props.addBlog (from App.jsx)
  // utilizing the state of the form { author: '', title: '', url: ''}
  const formHandler = (event) => {
    event.preventDefault()

    // Use passed functionality
    createBlog(blog)

    // Reset form
    setBlog({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={formHandler}>
      <div>
      Title:
        <input
          type="text"
          value={blog.title}
          name="title"
          data-testid="title"
          placeholder="title"
          onChange={({ target }) => setBlog({ ...blog, title: target.value })}
        />
      </div>

      <div>
      Author:
        <input
          type="text"
          value={blog.author}
          name="author"
          data-testid="author"
          placeholder="author"
          onChange={({ target }) => setBlog({ ...blog, author: target.value })}
        />
      </div>

      <div>
      Url:
        <input
          type="text"
          value={blog.url}
          name="url"
          data-testid="url"
          placeholder="url"
          onChange={({ target }) => setBlog({ ...blog, url: target.value })}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm