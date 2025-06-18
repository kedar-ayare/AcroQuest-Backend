require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const userRoutes = require('./routes/users');
const acroRoutes = require('./routes/acro')
const testRoutes = require('./routes/dummy')
const keyRoutes = require('./routes/keyExchange')



const app = express()


app.use(express.json())

if(process.env.NODE_ENV !== 'test'){
    mongoose.connect(process.env.DB_URL);

    const database = mongoose.connection

    database.on('error', (error) => {
        console.log(error)
    })
    database.once('connected', () => {
        console.log('Database Connected');
    })
}



app.use('/users', userRoutes)
app.use('/acro', acroRoutes)
app.use('/test', testRoutes)
app.use('/keys',keyRoutes)



// const { generateKeyPairSync } = require('crypto');

// const { publicKey, privateKey } = generateKeyPairSync('rsa', {
//   modulusLength: 2048,
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem'
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem'
//   }
// });

// console.log("Public Key:", publicKey);
// console.log("Private Key:", privateKey);

module.exports= app