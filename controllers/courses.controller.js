//import data
//let {courses} = require('../data/courses');
const {validationResult} = require('express-validator');
const Course = require('../models/courses.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const AppError = require('../utils/appError');

const getAllCourses = asyncWrapper(
    async (req, res)=>{
    // to Pagination
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page-1) * limit;
    // get all courses from DB using course Model
    const courses = await Course.find({},{"__v":false}).limit(limit).skip(skip);//find({1},{2}) => {2} this is projection: opthinal field return
    res.json({status: httpStatusText.SUCCESS, data: {courses}});// JSend format
});

const getCourse = asyncWrapper(
    async (req, res, next)=>{
    //try{
        const course = await Course.findById(req.params.courseId);
        if(!course){
            const error = AppError.create('course not found', 404, httpStatusText.FAIL);
            return next(error);
            //return res.status(404).json({status: httpStatusText.FAIL, data: {course: null}});
        }
        return res.json({status: httpStatusText.SUCCESS, data: {course}});
    //}catch(err){
    //    return res.status(400).json({status: httpStatusText.ERROR, data: null, message: err.message, code: 400});
    //}
    /*const courseId = +req.params.courseId; // + => casting to number
    const course = courses.find((course)=>course.id === courseId);*/
});

const addCourse =asyncWrapper(
    async (req ,res, next)=> {
    //console.log(req.body);
    //try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = AppError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(error);
            //return res.status(400).json({status: httpStatusText.FAIL, data: errors.array()});
        }
        const newCourse = new Course(req.body);
        await newCourse.save();
        return res.status(201).json({status: httpStatusText.SUCCESS, data: {course: newCourse}});
    //}catch(e){
    //    return res.status(400).json({error: e});
    //}
    
    //console.log("errors", errors);
    /* validation witeout express-validator
    if(!req.body.title){
    return res.status(400).json({error: "title not provided"});
    }
    if(!req.body.price){
    return res.status(400).json({error: "price not provided"});
    }
    */
   /*
    const course = {id: courses.length+1, ...req.body};
    courses.push(course);
    */
});

const updateCourse = asyncWrapper(
    async (req, res)=>{
    //try{
        const courseId = req.params.courseId;
        const updateCourse = await Course.updateOne({_id: courseId},{$set:{...req.body}});
        return res.status(200).json({status: httpStatusText.SUCCESS, data: {course: updateCourse}});
    //}catch(e){
    //    return res.status(400).json({status: httpStatusText.ERROR, message: e.message});
    //}
    
    /*const courseId = +req.params.courseId;
    let course = courses.find((course)=> course.id === courseId);
    if(!course){
        return res.status(404).json({msg: "course not found"});
    }
    course = {...course, ...req.body};
    */
    
});

const deleteCourse =  asyncWrapper(
    async (req, res)=>{
    await Course.deleteOne({_id: req.params.courseId});
    /*
    const courseId = +req.params.courseId;
    courses = courses.filter((course)=>course.id !== courseId);
    */
    res.status(200).json({status: httpStatusText.SUCCESS, data: null});
});

module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
}