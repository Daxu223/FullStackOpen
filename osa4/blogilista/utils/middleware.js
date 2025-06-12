const logger = require('./logger')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  if (request.method === 'POST') {
    logger.info(`${request.method} (${request.path}):`)
    logger.info('Body: ', request.body)
  } else {
    logger.info(`${request.method} (${request.path})`)
  }


  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  // Possible internal server errors by name can be handled and returned here
  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'Malformed id' })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'Expected username to be unique. Choose an another username' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Token invalid.' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'Token expired. PLease login again.' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = undefined
  }

  next()
}

// Struggled with this for a long time
const userExtractor = (request, response, next) => {
  request.user = undefined

  if (request.token) {
    try {
      // Verify user here, so that they don't have to be checked inside routes
      request.user = jwt.verify(request.token, process.env.SECRET)
    } catch (error) {
      // Let's errorHandler handle the error, if jwt is malformed
      next(error)
    }
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}