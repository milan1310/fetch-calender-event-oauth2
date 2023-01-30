require('dotenv').config();
const express = require('express');
const chalk = require('chalk')
const session = require('express-session')
const https = require('https')
const fs = require('fs')

const app = express();

const key = fs.readFileSync('key.pem');
const cert = fs.readFileSync('cert.pem');

// creating secure server on local host
const server = https.createServer({key:key,cert:cert},app)

// create session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

//connect db
const connectDB = require('./config/db');
connectDB();


// set middlewares
app.use(express.json());

//

// use routers
app.use('/', require('./routers/index.router'))


const port = 3000 || process.env.PORT;
server.listen(port, () => console.log(chalk.magenta(`server is running on ${port}`)))