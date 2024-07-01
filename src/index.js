//setup variables
require('dotenv').config(path = "../.env");

const express = require('express')
const app = express()

//setup database
const connection = require('./config/db.js')

//export app for further usage
module.exports = {express, app, connection}

//setup routes
require('./routes/auth/auth.js')
require('./routes/user/user.js')
require('./routes/todos/todos.js')

//setup server
app.listen(process.env.PORT, () => {
    console.log(`EpyTodo listening on port ${process.env.PORT}`)
})
