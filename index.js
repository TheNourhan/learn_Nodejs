require('dotenv').config();

const express = require('express');
const cors = require('cors'); // to handling CORS error in frontend
const app = express();
//app.use(express.static('./views'));

const path = require('node:path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const httpStatusText = require('./utils/httpStatusText');

const mongoose = require('mongoose');
const url = process.env.MONGO_URL; // -> require('dotenv').config();
mongoose.connect(url).then(()=>{
    console.log("mongodb server started");
});

app.use(cors());

app.use(express.json()); // to handle json body that coming from post req
// Route --> Resources
const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
app.use('/api/courses', coursesRouter); // localhost / => /api/courses
app.use('/api/users', usersRouter); // localhost / => /api/users

//app.use(express.static("uploads"));
app.use(express.urlencoded({extended:false}));
// set template engine
app.set("view engine", "ejs");
// route prefix
app.use("", require("./routes/users.route"));

// global middleware for not found router
app.all('*', (req, res, next)=>{
    return res.status(404).json({status: httpStatusText.ERROR, message: 'this resours is not avaliable'});
});
// global error handler
app.use((error, req, res, next)=>{  
    /* next(error):
       1- asyncWarpper catch the error in function
       2- then gave the error to the global middelware handler <here>*/                   
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data:null});
});

app.listen(process.env.PORT || 4000,()=>{
    console.log('listening on port 4000');
});