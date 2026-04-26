const express = require('express')
const bodyParser = require('body-parser') // import module body-parser
const mongoose = require('mongoose'); // import module mongoose
const path = require('path')


mongoose.connect('mongodb://127.0.0.1:27017/EDUKATE');





const app = express()  // creation app Express
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Security configuration
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Content-Type, X-Requested-with, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS, PATCH, PUT"
    );

    next();
});

const userRouter = require('./routes/users')
const coursesRouter = require('./routes/courses')
const noteRouter = require('./routes/notes')
const classRouter = require('./routes/classes')


app.use('/images', express.static(path.join('./images')))

app.use('/users' , userRouter)
app.use('/courses' , coursesRouter)
app.use('/notes' , noteRouter)
app.use('/classes' , classRouter)



module.exports = app // app exportable
