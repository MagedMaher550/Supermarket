const request =require('request');
const fetch = require('node-fetch');

exports.login=(req,res,next)=>{
    // res.sendFile(path.join(__dirname,'..','views','index.ejs'))
    res.render('../views/auth/login.ejs',{
        errorMessage:"",
        oldInput:{
            email:"",
            password:"",
          },
          authentication:req.session.isLoggedIn,
          admin:req.session.admin,
          points:req.session.points,
          username:req.session.username,
          userId:req.session.userId

    });
}

exports.register=(req,res,next)=>{
    // res.sendFile(path.join(__dirname,'..','views','index.ejs'))
    res.render('../views/auth/register.ejs',{
        errorMessage:"",
        oldInput:{
            username:"",
            email:"",
            password:"",
            address:""
          },
          authentication:req.session.isLoggedIn,
          admin:req.session.admin,
          points:req.session.points,
          username:req.session.username,
          userId:req.session.userId
    });
}

exports.getEnquiries = (req, res, next) => {
    res.render('../views/admin/enquiries.ejs',{
        authentication:req.session.isLoggedIn,
        admin:req.session.admin,
        points:req.session.points,
        username:req.session.username,
        userId:req.session.userId
    });
}

exports.getAddProduct = (req,res,next)=>{
    fetch('http://localhost:3052/feed/categories')
    .then(response => {
        response.json().then(data => {
            res.render('../views/admin/addProduct.ejs',{
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


// add products
exports.postSignup= (req,resmain,next) =>{
    
    const options = {
        url: 'http://localhost:3052/feed/signup',
        json: true,
        body: {
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            address:req.body.address,
        }  
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        if(body=="This Email Is Already Exist!!"){
            return resmain.status(422).render('../views/auth/register.ejs',{
              errorMessage:body,
              oldInput:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                address:req.body.address
              },
              authentication:req.session.isLoggedIn,
              admin:req.session.admin,
              points:req.session.points,
              username:req.session.username,
              userId:req.session.userId
              });
          }
          else{
           return resmain.redirect('/auth/login');
          }
    });
}

//login
exports.postLogin= (req,resmain,next) =>{
    console.log(req.body.email);
    console.log(req.body.password);
    const options = {
        url: 'http://localhost:3052/feed/login',
        json: true,
        body: {
            email:req.body.email,
            password:req.body.password,
        }  
    
    };

    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }

        if(body=="This Email Is Not Exist!!" || body=="Wrong password!!"){
            return resmain.status(422).render('../views/auth/login.ejs',{
              errorMessage:body,
              oldInput:{
                email:req.body.email,
                password:req.body.password,
              },
              authentication:req.session.isLoggedIn,
              admin:req.session.admin,
              points:req.session.points,
              username:req.session.username,
              userId:req.session.userId,
              email:req.session.email,
              address:req.session.address
              });
          }
          else{
            const tokenData=body;
            console.log(tokenData);
            req.session.isLoggedIn=true;
            req.session.userId=body.userId;
            req.session.admin=body.admin;
            req.session.username=body.username;
            req.session.points=body.points;
            req.session.email=body.email;
            req.session.address=body.address;
            
            console.log(tokenData);
            const options = {
                url: 'http://localhost:3052/feed/token',
                json: true,
                body: {
                  token:tokenData.token
                }
              };
            
              request.post(options, (err, response, body) => {
                if (err) { console.log(err); }
              });
           return resmain.redirect('/shop/');
          }
    });
}

//logout
exports.logout = (req, res, next) => {
    req.session.destroy(()=>{
      res.redirect('/shop');
    })
};

exports.updateUserAddress = (req, res, next) => {
    const options = {
        url: 'http://localhost:3052/feed/updateUserAddress',
        json: true,
        body: {
              id:req.body.id,
              address:req.body.address,
        }   
    };
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        // console.log(body);
    });
    req.session.address=req.body.address;
    res.redirect('/auth/myAccount');
};



// Fetch Orders
exports.getViewOrders = (req, res, next) => {    
    fetch('http://localhost:3052/feed/getAllOrders')
    .then(response => {
        response.json().then(data => {
            res.render('../views/admin/viewOrders.ejs',{                
                orders: data.orders,
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

// Fetch Orders
exports.getPlacedOrders = (req, res, next) => {    
    fetch('http://localhost:3052/feed/getPlacedOrders')
    .then(response => {
        response.json().then(data => {
            res.render('../views/admin/placedOrders.ejs',{                
                orders: data.orders,
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

// change order ready to true
exports.postOrderReady = (req,res,next) =>{
    
    const options = {
        url: 'http://localhost:3052/feed/orderReady',
        json: true,
        body: {
            orderId: req.body.orderId
        }
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
    res.redirect('/admin/placedOrders');
}

// change order shipped to true
exports.postOrderShipped = (req,res,next) =>{
    
    const options = {
        url: 'http://localhost:3052/feed/orderShipped',
        json: true,
        body: {
            orderId: req.body.orderId
        }
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
    res.redirect('/admin/placedOrders');
}

// change order arrived to true
exports.postOrderArrived = (req,res,next) =>{
    
    const options = {
        url: 'http://localhost:3052/feed/orderArrived',
        json: true,
        body: {
            orderId: req.body.orderId
        }
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
    res.redirect('/admin/placedOrders');
}


// eidt points
exports.postEditPoints = (req,res,next) =>{
    
    const options = {
        url: 'http://localhost:3052/feed/editPoints',
        json: true,
        body: {
            points: req.body.points,
        }  
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
    res.redirect('/shop/home');
}

// post enquiry
exports.postEnquiry = (req,res,next) =>{   
    const options = {
        url: 'http://localhost:3052/feed/enquiry',
        json: true,
        body: {
            userName: req.body.userName,
            userEmail:  req.body.userEmail,
            userEnquiry:  req.body.userEnquiry
        }  
    };
    
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
    res.redirect('/shop/home');
}


// Fetch Enquiries
exports.getEnquiries = (req, res, next) => {    
    fetch('http://localhost:3052/feed/enquiry')
    .then(response => {
        response.json().then(data => {
            res.render('../views/admin/enquiries.ejs',{                
                enquiries: data.enquiries,
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


exports.getUserData = (req, res, next) => {
    const url = `http://localhost:3052/feed/userData/${req.session.userId}`;
    fetch(url)
    .then(response => {
        response.json().then(data => {
            res.render('../views/shop/myAccount.ejs',{                
                authentication: req.session.isLoggedIn,
                admin: req.session.admin,
                points: data.points,
                username: data.username,
                userId: data.userId,
                email: data.email,
                address: data.address                
            });
        });
    })
    .catch(error => {
      console.log(error);
    });
}

exports.getUserOrders = (req, res, next) => {
    const url = `http://localhost:3052/feed/userOrders/${req.session.userId}`;
    fetch(url)
    .then(response => {
        response.json().then(data => {
            res.render('../views/shop/myOrders.ejs',{                
                authentication: req.session.isLoggedIn,
                admin: req.session.admin,
                orders: data.orders,
                username: data.username
            });
        });
    })
    .catch(error => {
      console.log(error);
    });
}

