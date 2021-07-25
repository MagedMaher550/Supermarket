const express=require('express');
const router=express.Router();

const bodyParser=require('body-parser');

const shopController =require('../controller/shop');
const userController =require('../controller/user');
const productController =require('../controller/products');

const middleware =require('../middleware/isauth');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/',shopController.homePage);

router.get('/home',shopController.homePage);

router.get('/faqs',shopController.FAQs);

router.get('/specials',shopController.Specials);

router.get('/about',shopController.about);

router.get('/brand',shopController.brand);

router.get('/contact',shopController.contact);

router.get('/searchResult',shopController.searchResult);

router.get('/cart',middleware.loggedin,shopController.getCartProducts);

router.get('/wishlist',middleware.loggedin,shopController.getWishlistProducts);

router.get('/userOrders',middleware.loggedin,userController.getUserOrders);

router.get('/ProductDetails/:productId',productController.getProductDetails);


router.post('/seacrhByImage',shopController.searchByImage);

router.post('/cart',shopController.postCart);

router.post('/deleteCartItem',shopController.postDeleteCartItem);

router.post('/deleteWishlistItem',shopController.postDeleteWishlistItem);

router.post('/decreaseCartItem',shopController.postDecreaseCartItem);

router.post('/wishlist',shopController.postWishlist);

router.post('/order',shopController.postOrder);

router.get('/category/:category',shopController.getCategories);



module.exports=router;