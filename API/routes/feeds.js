const express=require('express');
const router=express.Router();
const feedController =require('../controllers/feeds');


router.get('/categories',feedController.getCategories);

router.get('/ProductDetails',feedController.getProductById);

router.get('/getProducts',feedController.getProducts);

router.get("/getCart/:userId", feedController.getCartProducts)

router.get("/getWishlist/:userId", feedController.getWishlistProducts)

router.get("/getAllOrders", feedController.getAllOrders)

router.get("/getPlacedOrders", feedController.getPlacedOrders)

router.get('/enquiry',feedController.getEnquiries);

router.get('/userData/:userId',feedController.getUserData);

router.get("/userOrders/:userId", feedController.getUserOrders);


router.post('/enquiry',feedController.postEnquiry);

router.post('/addProduct',feedController.addProduct);

router.post('/deleteProduct',feedController.deleteProductById);

router.post('/updateProduct',feedController.updateProduct);

router.post("/deleteCartItem", feedController.postDeleteCart)

router.post("/deleteWishlistItem", feedController.postDeleteWishlistItem)

router.post("/decreaseCartItem", feedController.postDecreaseCartItem)

router.post('/cart',feedController.postCart);

router.post('/wishlist',feedController.postWishlist);

router.post('/order',feedController.postOrder);

router.post('/orderReady',feedController.readyTrue);

router.post('/orderShipped',feedController.shippedTrue);

router.post('/orderArrived',feedController.arrivedTrue);

router.post('/editPoints',feedController.postEditPoints);

router.post('/specials',feedController.getSpecialProducts);

router.get('/search',feedController.getSearchProducts);

router.get('/getCategory',feedController.getSearchCategory);

router.post('/signup',feedController.postSignup);

router.post('/login',feedController.postLogin);

router.post('/token',feedController.getToken);

router.post('/updateUserAddress',feedController.updateUserAddress);

router.get('/searchByImage',feedController.searchByImage);

module.exports = router;