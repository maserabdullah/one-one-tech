const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check presence and authenticity of the token in the incoming request
    if(token) {
        jwt.verify(token, 'I am a secret!@#$', (err, decodedToken) => {
            if(err) {
                //if there is an error in verifying authenticity of the token
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
} 

//check the current user
const checkUser = (req, res, next) => {
     const token = req.cookies.jwt;
     if(token) {
        //token exist, now we need to verify the token
        jwt.verify(token,'I am a secret!@#$', async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                
                //We need to set res.locals.user set to null because, in the views, we will check for user property. Same is the case if there are no token
                res.locals.user = null;
                next();
            } else {
                //everything is ok. user logged in with valid token
                 console.log(decodedToken); 
                 //The decodedToken contains the id of the logged in user. WE can find the user in the database with this id and then inject the use into the view
                 let user = await UserModel.findById(decodedToken.id);

                 //now we van inject the user into the views >> to be used in ejs files, specially in the header
                res.locals.user = user;
                next();
            }
        })
     } else {
         //no token >> not logged in
         res.locals.user = null;
         next();
     }
}

module.exports = {requireAuth, checkUser};