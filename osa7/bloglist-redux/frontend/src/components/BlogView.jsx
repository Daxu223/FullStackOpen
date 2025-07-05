import { Link } from 'react-router-dom'
import { useState } from 'react'

const LikeButton = ({ blog, onLike }) => {
  const likeFunction = async (blogObject) => {
    onLike(blogObject)
  }

  return (
    <button style={{ marginLeft: 3 }} onClick={() => likeFunction(blog)}>
      like
    </button>
  )
}

const Comments = ({ blog, onComment }) => {
  const [newComment, setNewComment] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    onComment(blog.id, newComment)
    setNewComment('')
  }

  return (
    <div>
      <h3>comments</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

const BlogDetails = ({ blog, onLike, onComment }) => {
  if (!blog) {
    return null
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <LikeButton blog={blog} onLike={onLike} />
      </div>
      <div>added by {blog.author}</div>
      <Comments blog={blog} onComment={onComment} />
    </div>
  )
}

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    paddingBottom: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <Link to={`/blogs/${blog.id}`}>
      <div className="blog" style={blogStyle}>
        {blog.title} {blog.author}
      </div>
    </Link>
  )
}

export { BlogDetails, Blog }
