const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
require('dotenv').config()
const Person=require('./models/person')
const person = require('./models/person')
const app=express()


app.use(cors())


app.use(express.json())

morgan.token('body', (req)=>{
  if(req.method==='POST'){
     return JSON.stringify(req.body)
  }
  return ''
})

const errorHandler=(error,request, response, next )=>{
  if(error.name==='CastError'){
    return response.status(400).send({error:'manlformatted it'})
  }
  next(error)
}


app.use(morgan(':method :url :status :res[content-length] -:response-time ms :body'))

let persons=[
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

const generatedId=()=>{
  const maxId=Math.max(...persons.map(p=>Number(p.id)));
  return(maxId + 1).toString();
}

app.get('/api/persons',(request,response)=>{
    Person.find({}).then(persons=>{
      response.json(persons)
    })
})

app.get('/info', (req,res,next)=>{
    const date=new Date()
    Person.countDocuments({})
.then(count=>{
  res.send(
    `<div>
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
    </div>`)

})
.catch(error=>next(error))

})

app.get('/api/persons/:id', (req,res,next)=>{
    Person.findById(req.params.id)
    .then(person=>{
      if(person){
        res.json(person)
      }else{
        res.status(404).send({error:'Person not found'})
      }
    })
    .catch(error=>next(error))
})





app.delete('/api/persons/:id',(req,res)=>{
  Person.findByIdAndDelete(req.params.id)
  .then(result=>{
    res.status(204).end()
  })
  .catch(error=>next(error))
})


app.post('/api/persons', (req,res,next)=>{
  const body=req.body

   if(!body){
    res.status(400).json({error: 'No Content Foud'})
  }

  if(!body.name){
     return res.status(400).json({error: 'Name is Required'})
  }

  if(!body.number){
     return res.status(400).json({error: ' Number is Required'})
  }

  Person.findOne({name:body.name})
  .then(existingPerson=>{
    if(existingPerson){
      return res.status(400).json({error:'Person already exists. Use another one'})
    }
    const person=new Person({
  name:body.name,
  number:body.number
});
return person.save()
  })
  .then(savedPerson=>{
    if(savedPerson){
      res.status(201).json(savedPerson);
    }
  })
  .catch(error=>next(error))
})

app.use(errorHandler)

const PORT=3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
