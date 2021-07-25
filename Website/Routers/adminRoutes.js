const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const prodcutController = require('../controller/products');
const userController = require('../controller/user');

const middleware =require('../middleware/isauth');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/viewOrders',middleware.loggedin,middleware.admin,userController.getViewOrders);

router.get('/placedOrders',middleware.loggedin,middleware.admin,userController.getPlacedOrders);

router.get('/addProduct',middleware.loggedin,middleware.admin,userController.getAddProduct);

router.get('/enquiries',userController.getEnquiries);

router.post('/addProduct',middleware.loggedin,middleware.admin,prodcutController.postAddProducts);

router.post('/editPoints',middleware.loggedin,middleware.admin,userController.postEditPoints);

router.post('/updateProduct',middleware.loggedin,middleware.admin,prodcutController.postupdateProducts);

router.post('/deleteProduct',middleware.loggedin,middleware.admin,prodcutController.postDeleteProducts);

router.post('/orderReady',middleware.loggedin,middleware.admin,userController.postOrderReady);

router.post('/orderShipped',middleware.loggedin,middleware.admin,userController.postOrderShipped);

router.post('/orderArrived',middleware.loggedin,middleware.admin,userController.postOrderArrived);

router.post('/enquiry',middleware.loggedin,userController.postEnquiry);

module.exports = router;