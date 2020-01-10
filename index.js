const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');
const userRouter = require('./routes/user');
const uploadRouter = require('./routes/upload');
const auth = require('./auth');


const app = express();
app.options('*', cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use("/public",express.static("./public"));

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then((db) => {
        console.log("Successfully connected to MongodB server");
    }, (err) => console.log(err));

app.use('/user', userRouter);
app.use('/upload', uploadRouter);
app.use(auth.verifyUser);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.statusCode = 500;
    res.json({ status: err.message });
});

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`);
});