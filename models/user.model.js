const mongoose = require('mongoose');
const validator = require('validator');
const userRols = require('../utils/userRoles');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'filed must be a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    },
    role: {
        type: String,
        enum: [userRols.USER, userRols.ADMIN, userRols.MANGER],
        default: userRols.USER  
    },
    avatar: {
        type: String,
        default: 'uploads/profile.png'
    }
});
module.exports = mongoose.model('User', userSchema);