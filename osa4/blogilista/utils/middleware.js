const logger = require('./logger')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  logger.info(`${request.method} (${request.path}):`)
  logger.info('Body: ', request.body)
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  
  // Possible errors by name can be handled and returned here
  // by status code
  
  if (error.name === 'SyntaxError') {
    return response.status(400).send({ error: 'Bad request, check input' })
  }
  
  next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}