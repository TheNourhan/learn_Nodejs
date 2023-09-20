const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError');

const verfiyToken = (req, res, next)=>{
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader){
        const error = AppError.create('token is required', 401, httpStatusText.ERROR);
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    try{
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();
    }catch(err){
        const error = AppError.create('invalid token', 401, httpStatusText.ERROR);
        return next(error);
    }
}
module.exports = verfiyToken;

/**
 * This middileware will not be allow this (getAllUsers) function to be executed,
 * unless it is from a logged in user.
 * It will be known whether the user is logged in or not via a token passed in the header.
 */