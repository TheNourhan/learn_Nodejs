const asyncWrapper = require('../middleware/asyncWrapper');
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');// to hashing password
const genrateJWT = require('../utils/genrateJWT');

const getAllUsers = asyncWrapper(async (req, res)=>{
    // to Pagination
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page-1) * limit;
    // get all Users from DB using course Model
    const users = await User.find({},{"__v":false, "password":false}).limit(limit).skip(skip);//find({1},{2}) => {2} this is projection: optinal field return
    res.json({status: httpStatusText.SUCCESS, data: {users}});// JSend format
});

const register = asyncWrapper(async(req, res, next)=>{
    const {firstName, lastName, email, password, role} = req.body;
    const oldUser = await User.findOne({email: email});
    if(oldUser){
        const error = AppError.create('user already exists', 400, httpStatusText.FAIL);
        return next(error);
    }
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(req.body);
    //console.log(req.file);
    //console.log(req.file.filename);
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role,
        //avatar: req.file.filename,
        avatar: req.body.filename,
    });
    console.log({URL: req.url});
    // generate JWT token
    const token = await genrateJWT({email: newUser.email, id:newUser._id, role: newUser.role});
    newUser.token = token;

    await newUser.save();
    res.status(201).json({status: httpStatusText.SUCCESS, data: {user: newUser}});
});

const login = asyncWrapper(async(req, res, next)=>{
    const {email, password} = req.body;
    if(!email && !password){
        const error = AppError.create('email and password are required', 400, httpStatusText.FAIL);
        return next(error);
    }
    const user = await User.findOne({email: email});
    if(!user){
        const error = AppError.create('user not found', 400, httpStatusText.ERROR);
        return next(error);
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if(user && matchedPassword){
        // logged in successfuly
        const token = await genrateJWT({email: user.email, id: user._id, role: user.role});
        return res.json({status: httpStatusText.SUCCESS, data: {token: token}});
        res.redirect("/");
    }else{
        const error = AppError.create('somthing wrong', 500, httpStatusText.ERROR);
        return next(error);
    }
});

module.exports = {
    getAllUsers,
    register,
    login
};