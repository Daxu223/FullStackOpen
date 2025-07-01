import { useState } from 'react'

// To note: blogs are rendered individually
// This means the state of all blogs are also individual
const Blog = ({ blog, user, onLike, onDelete }) => {

  // It would be better to define a state for this blog,
  // whether it is visible or not. If the controlling button is pressed
  // the state is set from non-visible to visible.
  // Earlier I tried to use Togglable but it was not completely suitable
  // for this use case scenario.
  const [detailsVisible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    paddingBottom: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!detailsVisible)
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        <span data-testid="blog-title-author">
          {blog.title} {blog.author}
        </span>
        <button
          className="detailsButton"
          style={{ marginLeft: 4 }}
          onClick={toggleVisibility}>
          {detailsVisible ? 'hide' : 'view' }
        </button>
      </div>

      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}
            <LikeButton blog={blog} onLike={onLike} />
          </div>
          <div>{blog.user.name}</div>
          <DeleteButton blog={blog} onDelete={onDelete} user={user} />
        </div>
      )}
    </div>
  )
}

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

const DeleteButton = ({ blog, onDelete, user }) => {
  const deleteButtonStyle = {
    background: 'linear-gradient(90deg, rgba(253,29,29,1) 17%, rgba(252,176,69,1) 100%)',
    borderRadius: '30px',
    color: 'white'
  }

  // Get the owner id of the blog and the current user from the App
  const blogOwnerUsername = blog.user.username

  // Noticed a problem where if the user is not logged in
  // And in for example tests, we want to just test the blog state
  // It crashes the application, so it was fixed with a null check.
  const currentUsername = user ? user.username : null

  // Here should exist some functionality to check if the userId from the blog
  // is the same as the requesting user.
  const deleteFunction = async (blogId) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onDelete(blogId)
    }
  }

  // Show the delete button if the user id is contained within the blogs
  // Initially, I wanted to use ids. The difficulty is that the user state
  // has token, name and user and no id.
  if (blogOwnerUsername === currentUsername)
    return (
      <button style={deleteButtonStyle} onClick={() => deleteFunction(blog.id)}>
        remove
      </button>
    )

  return null
}

export default Blog