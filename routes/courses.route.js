const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courses.controller');
const { validationSchema } = require('../middleware/validationSchema');
const verfiyToken = require('../middleware/verfiyToken');
const userRols = require('../utils/userRoles');
const allowedTo = require('../middleware/allowedTo');

/******* CRUD (Create, Read, Update, Delete) *******/
router.route('/')
        .get(courseController.getAllCourses)// Get all courses
        .post(verfiyToken, allowedTo(userRols.MANGER), validationSchema(), courseController.addCourse);// Create a new course

router.route('/:courseId')
        .get(courseController.getCourse)// Get a single course
        .patch(courseController.updateCourse)// Update a course
        .delete(verfiyToken, allowedTo(userRols.ADMIN, userRols.MANGER), courseController.deleteCourse);// Delete a course

module.exports = router;