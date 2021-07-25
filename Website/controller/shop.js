const express = require('express');
const fetch = require('node-fetch');
const request =require('request');


exports.getCartProducts = (req, res, next) => {
    const url= `http://localhost:3052/feed/getCart/${req.session.userId}`
    fetch(url)
    .then(response => {
        response.json().then(data => {
            res.render('../views/shop/cart.ejs',{                
                products: data.products,
                totalPrice: data.totalPrice,
                authentication:req.session.isLoggedIn,
                admin:req.session.admin,
                points:req.session.points,
                username:req.session.username,
                userId:req.session.userId
            });
        });
    })
    .catch(error => {
      console.log(error);
    });
}

exports.getWishlistProducts = (req, res, next) => {
    const url= `http://localhost:3052/feed/getWishlist/${req.session.userId}`
    fetch(url)
    .then(response => {
        response.json().then(data => {
            res.render('../views/shop/wishlist.ejs',{                
                products: data.products,
                authentication:req.session.isLoggedIn,
                admin:req.session.admin,
                points:req.session.points,
                username:req.session.username,
                userId:req.session.userId
            });
        });
    })
    .catch(error => {
      console.log(error);
    });
}

exports.postCart= (req,res,next) =>{
    const productId = req.body.id
    const productQty = req.body.productQty || 1;
    const options = {
        url: 'http://localhost:3052/feed/cart',
        json: true,
        body: {
            userId:req.session.userId,
              productId: productId,
              productQty: productQty,
              
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

// Deletes one cart item
exports.postDeleteCartItem= (req,res,next) =>{
    const productId = req.body.id
    const options = {
        url: 'http://localhost:3052/feed/deleteCartItem',
        json: true,
        body: {
              productId: productId,
              userId:req.session.userId
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

// Deletes one wishlist item
exports.postDeleteWishlistItem= (req,res,next) =>{
    const productId = req.body.id
    const options = {
        url: 'http://localhost:3052/feed/deleteWishlistItem',
        json: true,
        body: {
              productId: productId,
              userId:req.session.userId
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

// Decreases one cart item
exports.postDecreaseCartItem= (req,res,next) =>{
    const productId = req.body.id
    const options = {
        url: 'http://localhost:3052/feed/decreaseCartItem',
        json: true,
        body: {
              productId: productId,
              userId:req.session.userId
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

exports.postWishlist= (req,res,next) =>{
    const productId = req.body.id
    const options = {
        url: 'http://localhost:3052/feed/wishlist',
        json: true,
        body: {
            userId:req.session.userId,
              productId: productId,
              userId:req.session.userId
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

exports.postOrder = (req, res, next) =>{
    // const productId = req.body.id
    const options = {
        url: 'http://localhost:3052/feed/order',
        json: true,
        body: {
            userId:req.session.userId
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


exports.homePage = (req,res,next)=>{
     fetch('http://localhost:3052/feed/getProducts')
     .then(response => {
         response.json().then(data => {
             res.render('../views/shop/index.ejs',{                
                 products:data.products,
                 authentication:req.session.isLoggedIn,
                 admin:req.session.admin,
                 points:req.session.points,
                 username:req.session.username,
                 userId:req.session.userId
                 });
         });
     })
     .catch(error => {
       console.log(error);
     });
}

exports.FAQs=(req,res,next)=>{
    res.render('../views/shop/FAQs.ejs',{
        authentication:req.session.isLoggedIn,
        admin:req.session.admin,
        points:req.session.points,
        username:req.session.username,
        userId:req.session.userId
    });
}

exports.Specials=(req,resmain,next)=>{
  const options = {
        url: 'http://localhost:3052/feed/specials',
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        apiResponse = JSON.parse(body);
        resmain.render('../views/shop/specials.ejs',{
            products:apiResponse.products,
            authentication:req.session.isLoggedIn,
            admin:req.session.admin,
            points:req.session.points,
            username:req.session.username,
            userId:req.session.userId
        });
    });

}


exports.viewOrders=(req,res,next)=>{
    // res.sendFile(path.join(__dirname,'..','views','index.ejs'))
    res.render('../views/admin/viewOrders.ejs',{
        authentication:req.session.isLoggedIn,
        admin:req.session.admin,
        points:req.session.points,
        username:req.session.username,
        userId:req.session.userId
    });
}

exports.about=(req,res,next)=>{
    // res.sendFile(path.join(__dirname,'..','views','index.ejs'))
    res.render('../views/shop/about.ejs',{
        authentication:req.session.isLoggedIn,
        admin:req.session.admin,
        points:req.session.points,
        username:req.session.username,
        userId:req.session.userId
    });
}

exports.brand=(req,res,next)=>{
    // res.sendFile(path.join(__dirname,'..','views','index.ejs'))
    res.render('../views/shop/brand.ejs',{
        authentication:req.session.isLoggedIn,
        admin:req.session.admin,
        points:req.session.points,
        username:req.session.username,
        userId:req.session.userId
    });
}

exports.contact=(req,res,next)=>{
    // res.sendFile(path.join(__dirname,'..','views','index.ejs'))
    res.render('../views/shop/contact.ejs',{
        authentication:req.session.isLoggedIn,
        admin:req.session.admin,
        points:req.session.points,
        username:req.session.username,
        userId:req.session.userId
    });
}

exports.searchResult=(req,resmain,next)=>{

    const search= req.query.search;
    const options = {
        url: 'http://localhost:3052/feed/search',
        json: true,
        body: {
              search: search
        }
    };
    
    request.get(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        resmain.render('../views/shop/searchResult.ejs',{
            products:body.products,
            brandkey:body.brandkey,
            brandvalue:body.brandvalue,
            authentication:req.session.isLoggedIn,
            admin:req.session.admin,
            points:req.session.points,
            username:req.session.username,
            userId:req.session.userId,
            search:search
        });
    });
}

exports.searchByImage=(req,resmain,next)=>{

    const search= req.query.search;
    const options = {
        url: 'http://localhost:3052/feed/searchByImage',
        json: true,
        body: {
            inputImage: req.body.inputImage
        }
    };
    
    request.get(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log()
        resmain.render('../views/shop/searchResult.ejs',{
            products:body.products,
            brandkey:body.brandkey,
            brandvalue:body.brandvalue,
            authentication:req.session.isLoggedIn,
            admin:req.session.admin,
            points:req.session.points,
            username:req.session.username,
            userId:req.session.userId,
            search:search
        });
    });
}

// exports.searchByImage = (req,res,next) =>{   
//     const options = {
//         url: 'http://localhost:3052/feed/searchByImage',
//         json: true,
//         body: {
//             inputImage: req.body.inputImage
//         }  
//     };
    
//     request.post(options, (err, res, body) => {
//         if (err) {
//             return console.log(err);
//         }
//     });
//     res.redirect('/shop/home');
// }


exports.cart=(req,res,next)=>{
    // res.sendFile(path.join(__dirname,'..','views','index.ejs'))
    res.render('../views/shop/cart.ejs',{
        authentication:req.session.isLoggedIn,
        admin:req.session.admin,
        points:req.session.points,
        username:req.session.username,
        userId:req.session.userId
    });
}

exports.wishlist=(req,res,next)=>{
    // res.sendFile(path.join(__dirname,'..','views','index.ejs'))
    res.render('../views/shop/wishlist.ejs',{
        authentication:req.session.isLoggedIn,
        admin:req.session.admin,
        points:req.session.points,
        username:req.session.username,
        userId:req.session.userId
    });
}

// exports.myAccount=(req,res,next)=>{
//     res.render('../views/shop/myAccount.ejs',{
//         authentication: req.session.isLoggedIn,
//         admin: req.session.admin,
//         points: req.session.points,
//         username: req.session.username,
//         userId: req.session.userId,
//         email: req.session.email,
//         address: req.session.address
//     });
// }

//navbar search category
exports.getCategories = (req, resmain, next)=>{
    const options = {
        url: 'http://localhost:3052/feed/getCategory',
        json: true,
        body: {
            category:req.params.category,
        }
        
    };
    request.get(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        resmain.render('../views/shop/searchResult.ejs',{
            products:body.products,
            brandkey:body.brandkey,
            brandvalue:body.brandvalue,
            authentication:req.session.isLoggedIn,
            admin:req.session.admin,
            points:req.session.points,
            username:req.session.username,
            userId:req.session.userId
        });
    });   
}
