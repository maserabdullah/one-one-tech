const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const {getDbConnection} = require('./config/dbConnection');
const htmlController = require('./controllers/htmlControllers');
const authController = require('./controllers/authController');
const cookieParser = require('cookie-parser');

const app = express();

//middleware
app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

//template engine
app.set('view engine', 'ejs');

//database connectivity, port and listening 
const port = process.env.PORT || 3000;
mongoose.connect(getDbConnection(),
 { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then( result => app.listen(port, console.log(`server is up on port ${port}`)) )
.catch(err => console.log(err));

//controllers
htmlController(app);
authController(app);

