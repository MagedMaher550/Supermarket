const request =require('request');
const fetch = require('node-fetch');
const { body } = require('express-validator');


// add products
exports.postAddProducts= (req,res,next) =>{
    
    const options = {
        url: 'http://localhost:3052/feed/addProduct',
        json: true,
        body: {
              title: req.body.productName,
              oldPrice: req.body.oldPrice,
              newPrice: req.body.newPrice,
              image: req.body.image,
              description: req.body.description,
              brand: req.body.brand,
              mainCategory: req.body.mainCategory
        }
        
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        // console.log(body);
    });
    res.redirect('/shop');
}

// delete products
exports.postDeleteProducts= (req,res,next) =>{
    
    const options = {
        url: 'http://localhost:3052/feed/deleteProduct',
        json: true,
        body: {
              id:req.body.id,
        }  
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        // console.log(body);
    });
    res.redirect('/shop');
}

//update products
exports.postupdateProducts= (req,res,next) =>{
    
    const options = {
        url: 'http://localhost:3052/feed/updateProduct',
        json: true,
        body: {
              id:req.body.id,
              title:req.body.productName,
              oldPrice:req.body.oldPrice,
              newPrice:req.body.newPrice,
              image:req.body.image,
              description:req.body.description,
              brand:req.body.brand,
              mainCategory: req.body.mainCategory
        }
        
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        // console.log(body);
    });
    res.redirect('/shop');
}

//get product details
exports.getProductDetails= (req,resmain,next) =>{
    const options = {
        url: 'http://localhost:3052/feed/ProductDetails',
        json: true,
        body: {
               id:req.params.productId,
        }
        
    };
    request.get(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        resmain.render('../views/shop/product.ejs',{
            product: body.product,
            productPriceInPoints: body.productPriceInPoints,
            authentication:req.session.isLoggedIn,
        admin:req.session.admin,
        points:req.session.points,
        username:req.session.username,
        userId:req.session.userId,
        email:req.session.email,
        address:req.session.address

        });
    });    
   
}

