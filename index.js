const express = require('express')
const app = express()
const morgan = require("morgan")

app.use(express.json())

app.use(morgan('tiny'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323532"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-34-234534"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-7586748"
    }
]

app.get('/', (rq, res) => {
    res.send('<h1>Hey</h1>')
})
app.get('/api/persons',(req, res) => {
    res.json(persons)
})
app.get('/info',(req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
    
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})
const generateId = () => {
    min = Math.ceil(persons.length)
    max = 10000
    return Math.floor(Math.random() * (max - min) + min); 
}

app.post('/api/persons', (req, res) => {

    const body = req.body

    if(!body.name) {
        return res.status(400).json({error: 'name missing'})
    }
    if(!body.number) {
        return res.status(400).json({error: 'number missing'})
    }
    if(JSON.stringify(persons).includes(body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    
    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
