const app = require('../app') // Needed for sending HTTP requests
const supertest = require('supertest')
const api = supertest(app) // For testing backend with HTTP-requests

const Blog = require('../models/blog')
const User = require('../models/user')

// These blogs get saved to the database but without a user
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const getBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const createBlog = (title, author, url, likes) => {
  return {
    title: title,
    author: author,
    url: url,
    likes: likes
  }
}

const getUsers = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createUserAndgetLoginToken = async (username, password) => {
  const user = {
    "username": `"${username}"`,
    "password": `"${password}"`
  }

  // Create a user
  await api
    .post('/api/users')
    .send(user)
    .expect(201)

  // Login the user to get a token
  const response = await api
    .post('/api/login')
    .send(user)
    .expect(200)

  return response.body.token
}

const createBlogPostWithUserToken = async (token, blog) => {
  return await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
}

module.exports = {
  initialBlogs,
  getBlogs,
  getUsers,
  createBlog,
  createUserAndgetLoginToken,
  createBlogPostWithUserToken
}