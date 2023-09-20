const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const verfiyToken = require('../middleware/verfiyToken');
const multer  = require('multer');
const appError = require('../utils/appError');

const diskStorage = multer.diskStorage({
        destination: function(req, file, cb){
                cb(null, './uploads');
        },
        filename: function(req, file, cb){
                const ext = file.mimetype.split('/')[1];
                const fileName = `user-${Date.now()}.${ext}`;
                cb(null, fileName);
                //cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
});
const fileFilter = (req, file, cb) => {
        const imageType = file.mimetype.split('/')[0];
        if(imageType === 'image'){
                return cb(null, true);
        }else{
                return cb(appError.create('this must be an image', 400), false);
        }
}
const upload = multer({ storage: diskStorage, fileFilter: fileFilter}).single('avatar');

router.route('/')
        .get(verfiyToken, usersController.getAllUsers)

router.route('/register')
        .post(upload, usersController.register)
        .get((req, res)=>{
                res.render('index', {title: "registar page"});
        })

router.route('/login')
        .post(usersController.login)
        .get((req, res)=>{
                res.render('login', {title: "login page"});
        })


module.exports = router;