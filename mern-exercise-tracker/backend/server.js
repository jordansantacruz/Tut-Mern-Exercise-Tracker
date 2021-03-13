const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//We're setting up a remote server through MongoDb Atlus.
//The link to our atlus server space is in the .env (dotenv) file
//When we set up our server, we run this JS file and create a bridge to our server
//The API endpoints are hosted locally, but all they do is send requests that change our remote server
require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLUS_URI;
mongoose.connect(uri, {useNewUrlParser: true, 
    useCreateIndex: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});