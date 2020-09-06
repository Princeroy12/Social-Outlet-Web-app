const express=require('express')
const app=express()
const mongoose=require('mongoose')
const {MONGOURI}=require('./key')
const PORT=5000
//NbzGy4O4ZDIEhLAM



mongoose.connect(MONGOURI,{ useNewUrlParser: true , useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)
mongoose.connection.on('connected',()=>{
    console.log('connected to mongodb')
})
mongoose.connection.on('error',(err)=>{
    console.log('connection error')
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))




app.listen(PORT,()=> console.log('the server is hosted at the port'))