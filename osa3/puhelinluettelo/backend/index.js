const express = require("express")
const morgan = require("morgan")

const app = express()

app.use(express.json())
app.use(express.static('dist')) // Serve static files from the 'dist' directory

// Define custom Morgan token for request body
morgan.token('reqbody', function(req) {
    return JSON.stringify(req.body);  
});
  
app.use(morgan(':method :url :res[content-length] - :response-time ms :reqbody'))

let persons = [  
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    }, 
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {   id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"  
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get("/info", (request, response) => {
    const personCount = persons.length
    const date = new Date()

    response.send(`
        <p>Phonebook has info for ${personCount} people</p>
        <p>${date}</p>`)
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = body.name

    const nameAlreadyExists = persons.some(person => person.name === name)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Name or number missing"
        })
    } else if (nameAlreadyExists) {
        return response.status(400).json({
            error: "Name must be unique"
        })
    }

    const person = {
        id: String(Math.floor(Math.random() * 10000)),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})