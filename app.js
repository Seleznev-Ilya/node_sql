const { __express } = require("hbs");
const passport = require('passport');
const morgam = require("morgan");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser")
const upload = require('express-fileupload');


app.set('view engine', 'hbs');
dotenv.config({ path: './.env' });

// DB _________________________________________

const db = require('./dataBase/db');
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL Connected...");
    }
})

// APP _________________________________________

const pupblicDirectory = path.join(__dirname, './pablic'); // PUBLIC 
app.use(express.static(pupblicDirectory));

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use(express.json());
app.use(cookieParser());

app.use('/', require('./routes/pages'));
app.use('/api', require('./routes/api'));

app.use(upload());

app.listen(8080, () => {
    console.log(`Server's been started ...`);
})
