const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

logger.info('Connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to db\n')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

// Define app to use static folder 'dist' if frontend is built here
app.use(express.json())

// Middlewares before routes, so that they can use them
app.use(middleware.requestLogger)

// Enable first: this way the userExtractor can use the request.token
app.use(middleware.tokenExtractor)

// Tell router to use /api/ endpoint
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
  console.log('Testing environment running...')
  console.log('No logging output is shown in this mode.')
}

// Executed, if routes do not throw next directly
app.use(middleware.unknownEndpoint)

// Executed, if routes throw error(next)
app.use(middleware.errorHandler)

module.exports = app