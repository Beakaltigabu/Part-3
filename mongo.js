const mongoose=require('mongoose')


if(process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password=process.argv[2]

const url=`mongodb+srv://beakaltigabu:${password}@fso-cluster.ffipyox.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FSO-cluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema=new mongoose.Schema({
    name:String,
    number:String,
})

const Person=mongoose.model('Person',personSchema)

if(process.argv.length===3){
    Person.find({}).then(result=>{
        result.forEach(person=>{
            console.log(person)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length>3){
    const person=new Person({
        name:process.argv[3],
        number:process.argv[4],
    })
    person.save().then(result=>{
        console.log('person saved!')
        mongoose.connection.close()
    })
}


