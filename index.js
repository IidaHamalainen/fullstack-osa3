require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())



app.get('/', (rq, res) => {
  res.send('<h1>Hey</h1>')
})
app.get('/api/persons',(req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info',(req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(result => {
    if(result) {
      res.status(204).end()
    } else {
      res.status(404).send('Error 404').end()
    }
  })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {

  const body = req.body

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  Person.findOne( { name: person.name }).then(result => {
    if(result) {
      return res.status(400).send('Person is already in the phonebook')
    }
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))

})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
