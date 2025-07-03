const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app') // For sending HTTP-requests to the backend
const api = supertest(app) // For testing backend with HTTP-requests

beforeEach(async () => {
  await User.deleteMany({})
})

describe('Test user creation and validation', () => {
  test('User is created with the correct fields', async () => {
    const user =
    {
      username: 'testitunnus',
      name: 'testinimi',
      password: 'testisalasana'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersInDb = await helper.getUsers()
    const createdUser = usersInDb[0]

    assert(createdUser.username === user.username)
    assert(createdUser.name === user.name)
  })
  test('Cannot create an user without username', async () => {
    const user =
    {
      name: 'testi',
      password: 'testi'
    }

    const response = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // Response should include 'username', format is 'Please enter a username'
    assert(response.body.error.toLowerCase().includes('username'))
  })

  test('Cannot create an user without a password', async () => {
    const user =
    {
      username: 'testi',
      name: 'testi'
    }

    const response = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // Response should include 'password, format is 'Please enter a password'
    assert(response.body.error.toLowerCase().includes('password'))
  })

  test('Cannot create user with an username less than three characters long', async () => {
    const user =
    {
      username: 'asf',
      name: 'testi',
      password: 'testi'
    }

    const response = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // Response should include 'longer, format is 'Username must be longer than 3 characters'
    assert(response.body.error.toLowerCase().includes('username')
    && response.body.error.toLowerCase().includes('longer'))
  })

  test('Cannot create an user with a password less than three characters long', async () => {
    const user =
    {
      username: 'testi',
      name: 'testi',
      password: 'asf'
    }

    const response = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // Response should include 'longer, format is 'Password must be longer than 3 characters'
    assert(response.body.error.toLowerCase().includes('password')
    && response.body.error.toLowerCase().includes('longer'))
  })

  test('Username should be unique', async () => {
    const user =
    {
      username: 'testi',
      name: 'testi',
      password: 'testi'
    }

    const initialUsersInDb = await helper.getUsers()

    // Create user successfully
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const afterFirstAddInDb = await helper.getUsers()
    assert.strictEqual(initialUsersInDb.length, afterFirstAddInDb.length - 1)

    // Create user that is not unique, should not be added
    await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const afterSecondAddInDb = await helper.getUsers()
    assert.strictEqual(afterFirstAddInDb.length, afterSecondAddInDb.length)
  })

})

// Close connection to database because tests would not get executed completely
after(async () => {
  await mongoose.connection.close()
})