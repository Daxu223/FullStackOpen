const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async(request, response, next) => {
  try {
    const blogBody = request.body

    // Check if requesting user has a valid id first
    if (!request.user || !request.user.id) {
      return response.status(401).json({ error: 'Token invalid' })
    }

    // Finds the referenced user from the collection
    const user = await User.findById(request.user.id)
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Validate required fields
    if (!blogBody.url || !blogBody.title) {
      return response.status(400).json({ error: 'Title and URL are required' })
    }

    // Sets likes to zero, if they do not exist
    const blog = new Blog({
      title: blogBody.title,
      author: blogBody.author,
      url: blogBody.url,
      likes: blogBody.likes || 0,
      user: user._id
    })

    // Save blog using the schema and add the blog reference to users
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

// One missing option but not in exercises:
// blogsRouter.get('/:id => {}): will respond with 'Unknown endpoint'!

blogsRouter.delete('/:id', async(request, response, next) => {
  try {
    // Grab user from from request, added initially in userExtractor
    const requestingUser = request.user

    // Token is already validated in a middleware
    // This should only happen if user has been deleted from the database
    // Before the token expires and is grabbed from login
    if (!requestingUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Check if blog exists by trying to find user given id
    // Note: if id does not exists, program throws CastError
    // which is handled by the middleware. Not here.
    const blog = await Blog.findById(request.params.id)

    // When finding the user, we get the id of the user who requested it
    // Check if the user is the creator of the blog
    if (blog.user.toString() !== requestingUser.id.toString()) {
      return response.status(401).json({ error: 'Unauthorized to delete this blog' })
    }

    // Deletes the blog
    await Blog.findByIdAndDelete(blog.id.toString())
    response.status(204).end() // 204 No Content

  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async(request, response, next) => {
  try {
    const newBlogPost = request.body
    const requestingUser = request.user

    if (!newBlogPost) {
      return response.status(400).json({ error: 'Request body is required.' })
    }

    if (!requestingUser) {
      return response.status(401).json({ error: 'User not found' })
    }

    // Find the original blog post
    const originalBlogPost = await Blog.findById(request.params.id)
    if (!originalBlogPost) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    // This was not in the exercises but it bothered me a bit:
    // If the requesting user is not the owner of the blog, don't let user update the blog
    if (originalBlogPost.user.toString() !== requestingUser.id.toString()) {
      return response.status(401).json({ error: 'Not authorized to update this blog' })
    }

    // This saves the blog to the database with changes
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      newBlogPost,
      { new: true, runValidators: true }
    )

    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
