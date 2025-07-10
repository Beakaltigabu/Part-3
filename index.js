const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

app.use(cors())


app.use(express.json())
app.use(express.static('dist'))


morgan.token('body', (req) => {
  try {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
  } catch (err) {
    return '[Circular]'
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <div>
          <p>Phonebook has info for ${count} people</p>
          <p>${date}</p>
        </div>
      `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).send({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body || !body.name || !body.number) {
    return res.status(400).json({ error: 'Name and Number are required' })
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return res.status(400).json({ error: 'Person already exists. Use another name.' })
        return null
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      })

      return person.save()
    })
    .then(savedPerson => {
      if (savedPerson) {
        res.status(201).json(savedPerson)
      }
    })
    .catch(error => next(error))
})

app.put('/api/perons/:id',(req,res,next)=>{
  const {name, number}=req.body
  const updatedPerson={
    name,
     number
  }

  Person.findByIdAndUpdate(
    req.params.id,
    updatedPerson,
    {
      new:true,
      runValidators:true,
      context:'query'
    }
  )
  .then(updated=>{
    if(updated){
      res.json(updated)
    }else{
      res.status(404).send({error:'person not found'})
    }
  })
  .catch(error=>next(error))

})

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
