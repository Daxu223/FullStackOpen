const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const app = express()

logger.info('Connecting to', config.MONGODB_URI)

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message)
    })

// Define app to use static folder 'dist' if frontend is built here
app.use(express.json())

// define logging middleware here
app.use(middleware.requestLogger)

// Tell router to use /api/blogs endpoint
app.use('/api/blogs', blogsRouter)

// Executed, if routes do not throw next directly
app.use(middleware.unknownEndpoint)

 // Executed, if routed throw next to error
app.use(middleware.errorHandler)

module.exports = app