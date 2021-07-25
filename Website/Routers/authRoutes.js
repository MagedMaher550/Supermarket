const express=require('express');
const router=express.Router();

const bodyParser=require('body-parser');
const path = require('path');
const middleware =require('../middleware/isauth');
const userController =require('../controller/user');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/login',userController.login);
router.get('/register',userController.register);

router.get('/myAccount',middleware.loggedin,userController.getUserData);

router.post('/signup',userController.postSignup);
router.post('/login',userController.postLogin);

router.get('/logout',userController.logout);
router.post('/updateUserAddress',userController.updateUserAddress);


module.exports=router;