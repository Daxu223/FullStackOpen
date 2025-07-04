const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  // Passwords comes from users in plaintext
  const { username, name, password } = request.body

  // Validate
  if (!username) {
    return response.status(400).json({ error: 'Please enter a username' })
  } else if (username.length <= 3) {
    return response.status(400).json({ error: 'Username must be longer than 3 characters' })
  }

  if (!password) {
    return response.status(400).json({ error: 'Please enter a password' })
  } if (password.length <= 3) {
    return response.status(400).json({ error: 'Password must be longer than 3 characters' })
  }

  // Async is used here because hashing is expensive
  // Bcrypt also returns a promise,
  const rounds = 10
  const passwordHash = await bcrypt.hash(password, rounds)

  // If all is ok, create the user
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User
    .findById(request.params.id)
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

  if (!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  response.json(user)

})

module.exports = usersRouter