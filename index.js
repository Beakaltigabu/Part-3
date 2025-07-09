const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
const app=express()


app.use(cors())


app.use(express.json())

morgan.token('body', (req)=>{
  if(req.method==='POST'){
     return JSON.stringify(req.body)
  }
  return ''

})

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
    response.json(persons)
})

app.get('/info', (req,res)=>{
    const date=new Date()
    res.send(`<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        </div>`)
})

app.get('/api/persons/:id', (req,res)=>{
    const id=req.params.id
    const person=persons.find(p=>p.id===id)
    if(person){
        res.send(person)
    }else{person
        res.status(404).end()
    }
})


app.delete('/api/persons/:id',(req,res)=>{
  const id=req.params.id
   persons=persons.filter(p=>p.id !==id)

  res.status(204).end()
})


app.post('/api/persons', (req,res)=>{
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

   const nameExists=persons.some(p=>p.name===body.name);
   if(nameExists){
   return res.status(400).json({error:'Name must be unique'});
   }



  const newPerson={
    id:generatedId(),
    name:body.name,
    number:body.number
  }
  persons.push(newPerson)
  res.status(201).json(newPerson)

})


const PORT=3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
