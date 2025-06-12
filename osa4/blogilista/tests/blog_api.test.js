const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app') // For sending HTTP-requests to the backend
const api = supertest(app) // For testing backend with HTTP-requests

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promises = blogObjects.map(blog => blog.save())
  await Promise.all(promises)
})

describe('GET /api/blogs', () => {
  test('application returns correct amount of blogs in json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs are identified with the field \'id\'', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert(Object.keys(blog).includes('id'))
    })
  })
})

describe('POST /api/blogs', () => {
  test('logged in user can add blogs', async () => {
    const newBlog = helper.createBlog('React patterns', 'Michael Chan', 'https://reactpatterns.com/', 7)
    const loginToken = await helper.createUserAndgetLoginToken('daxu', 'daxu')
    const response = await helper.createBlogPostWithUserToken(loginToken, newBlog)

    assert.strictEqual(response.status, 201)
    assert.strictEqual(response.body.title, 'React patterns')

  })

  test('used cannot add blogs unauthorized', async () => {
    const newBlog = helper.createBlog('React patterns', 'Michael Chan', 'https://reactpatterns.com/', 7)

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('invalid'))
  })

  test('if no likes are given, likes default to 0', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
    }
    const loginToken = await helper.createUserAndgetLoginToken('daxu', 'daxu')

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('if blog does not contain title or url, respond with 400 Bad Request', async () => {
    const loginToken = await helper.createUserAndgetLoginToken('daxu', 'daxu')
    const posts = [
      { author: 'Me', url: 'http://localhost:3001', likes: 100 },
      { title: 'The tale of localhost', author: 'Me', likes: 100 },
      { author: 'Me', likes: 100 }
    ]

    for (const post of posts) {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(post)
        .expect(400)

      const blogsInDb = await helper.getBlogs()
      assert.strictEqual(helper.initialBlogs.length, blogsInDb.length)
    }
  })

})

describe('DELETE /api/blogs/:id', () => {
  test('logged in user can delete own blog', async () => {
    const newBlog = await helper.createBlog('React patterns', 'Michael Chan', 'https://reactpatterns.com/', 7)
    const loginToken = await helper.createUserAndgetLoginToken('daxu', 'daxu')

    // Create post for the original user
    const postCreationResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const createdBlogId = postCreationResponse.body.id

    const deletionResponse = await api
      .delete(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(204)

    const blogsInDb = await helper.getBlogs()
    assert.strictEqual(blogsInDb.length, helper.initialBlogs.length)
    assert.strictEqual(deletionResponse.status, 204)
  })

  test('logged in user cannot delete other user\'s blog', async () => {
    const newBlog = helper.createBlog('React patterns', 'Michael Chan', 'https://reactpatterns.com/', 7)
    const rightPersonLoginToken = await helper.createUserAndgetLoginToken('daxu', 'daxu')
    const wrongPersonLoginToken = await helper.createUserAndgetLoginToken('bad', 'bad')

    // Create post for the original user
    const postCreationResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${rightPersonLoginToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const createdBlogId = postCreationResponse.body.id

    // Wrong person tries to delete the original user's blog post, evil man
    const deletionResponse = await api
      .delete(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer ${wrongPersonLoginToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(deletionResponse.status, 401)
    assert(deletionResponse.body.error.includes('Unauthorized'))
  })

})

describe('PUT /api/blogs/:id', () => {
  test('a blog can be updated', async () => {
    const loginToken = await helper.createUserAndgetLoginToken('daxu', 'daxu')
    const newBlog = helper.createBlog('Testing', 'Daxu', 'localhost:3001', 1337)
    const response = await helper.createBlogPostWithUserToken(loginToken, newBlog)

    assert.strictEqual(response.status, 201)
    const createdBlogId = response.body.id
    const updatedBlog = helper.createBlog('Updating', 'Daxu', 'localhost:3001', 1337)

    await api
      .put(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .send(updatedBlog)
      .expect(200)

    const updatedBlogsInDb = await helper.getBlogs()
    const updatedBlogInDb = updatedBlogsInDb.find(blog => blog.id === createdBlogId)

    assert.strictEqual(updatedBlogInDb.author, 'Daxu')
    assert.strictEqual(updatedBlogInDb.title, 'Updating')
  })
})

// Close connection to database because tests would not get executed completely
after(async () => {
  await mongoose.connection.close()
})