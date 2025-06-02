require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist')) // Serve static files from the 'dist' directory

// Define custom Morgan token for request body
morgan.token('reqbody', function(req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :res[content-length] - :response-time ms :reqbody'))

app.get('/info', (request, response, next) => {
  Person.countDocuments({}).then(personCount => {
    const date = new Date()
    response.send(`
            <p>Phonebook has info for ${personCount} people</p>
            <p>${date}</p>`)
  })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

// Using next to forward a possible error event
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    console.log('error in name adding')

    return response.status(400).json({
      error: 'Name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedNumber => {
    response.json(savedNumber)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log(request.body)

  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error) // Pass unhandled errors to Express default handler
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})