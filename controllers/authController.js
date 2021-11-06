const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {checkUser} = require('../middleware/authMiddleware');

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code); //err.code is related with unique property in the schema definition
    let errors = {email: '', password: ''};

    //duplicate email ... error handling
    if(err.code === 11000) {
        console.log('duplicate error')
        errors.email = 'Email is already registered';
        return errors;
    }

    //login ... incorrect email
    if(err.message === 'Incorrect email') {
        errors.email = 'That email is not registered';
    }   
    //login ... incorrect password
    if(err.message === 'Incorrect password') {
        errors.password = 'That password is incorrect';

    }

    //validation errors
    if(err.message.includes('user validation failed')) {        
        Object.values(err.errors).forEach( ({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    if(err.message === '') {

    }
    return errors;
} 

//Function for generating JWT
const maxAge = 3 * 24 * 60 * 60 //... 3 days in seconds
const createToken = id => {
    return jwt.sign( {id}, 'I am a secret!@#$', {
        expiresIn: maxAge
    });
}

module.exports = function(app) {
    app.get('*', checkUser);

    app.get('/signup', (req,res) => {
        res.render('signup');
    });

    app.get('/login',  (req, res) => {
        res.render('login')
    });

    //logout
    app.get('/logout', (req, res) => {
        res.cookie('jwt', '', {maxAge: 1});
        res.redirect('/');
    })

    app.post('/signup', async (req, res) => {
        const {email, password} = req.body;
        
        try {
            const newUser = await UserModel.create({email, password});
            
            //create jwt
            const token = createToken(newUser._id);

            //Put the token inside the cookie
            res.cookie('jwt', token, {
                maxAge: maxAge * 1000, //converted into milliseconds
                httpOnly: true
            });

            res.status(200).json({newUser: newUser._id});

        } catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});            
        }
    });
    
    app.post('/login', async (req, res) => {
        const {email, password} = req.body;


        try {
            const loginUser = await UserModel.login(email, password);
            const token = createToken(loginUser._id);
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            });

            res.status(200).json({loginUser : loginUser._id});
            
        } catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }
      
    })
}