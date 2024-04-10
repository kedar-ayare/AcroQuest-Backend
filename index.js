require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const userRoutes = require('./routes/users');
const acroRoutes = require('./routes/acro')


const app = express()


app.use(express.json())
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})
mongoose.connect(process.env.DB_URL);

const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})


app.use('/users', userRoutes)
app.use('/acro', acroRoutes)
