const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        lowercase: true,
        unique: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter the password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
});

//fire a function after doc is saved to db ... mongoose hooks -post
// userSchema.post('save', function(doc, next) {
//     console.log('new user is created', doc);

//     next();
// });

//fire a function before a doc is saved to db ... mongoose hook - pre
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});


//static method to assist in login process
userSchema.statics.login = async function(email, password) {


    const loginUser = await this.findOne({email});


    if(loginUser) {
        const auth = await bcrypt.compare(password, loginUser.password);
        if(auth) {
            return loginUser;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;