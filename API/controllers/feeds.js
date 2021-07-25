const Product = require('../models/product');
const User = require('../models/user');
const Point = require("../models/points");
const Order = require("../models/order");
const Category = require("../models/category");
const Enquiry = require("../models/enquiry");
let session = require('express-session');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const pythonShell = require('python-shell');
const product = require('../models/product');



// Fetch All Categories
exports.getCategories = (req, res, next) => {
  Category.find()
    .then(categories => {
      res.status(200).json({
        message: "Fetched Categories Succussfully",
        categories: categories
      })
    })
    .catch(err => {
      console.log(err);
    })
}

// Post Enquiry
exports.postEnquiry = (req, res, next) => {

  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userEnquiry = req.body.userEnquiry;

  const enquiry = new Enquiry({
    userName: userName,
    userEmail: userEmail,
    userEnquiry: userEnquiry
  })

  enquiry.save()
  .then(result => {
      res.status(200).json({
          message: 'Enquiry Sent successfully.',
          post: result
        });
    })
  .catch(err => {
    console.log(err);
  });
}

exports.getEnquiries = (req, res, next) => {
  Enquiry.find()
    .then(enquiries => {
      res.status(200).json({
        message: "Enquiries fetched successfully",
        enquiries: enquiries
      })
    })
}

// Post order
exports.postOrder = (req, res, next) => {

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();  
  let hour = today.getHours();
  let minute = today.getMinutes();
  let second = today.getSeconds();
  today = dd + '/' + mm + '/' + yyyy + " - " + hour + ":" + minute + ":" + second;

  User.findById(req.body.userId)
    .then(user => {
      req.user = user;
      req.user
      .populate("cart.items.productId")
      .execPopulate()
      .then(user => {
        const products = user.cart.items.map(data => {
          return {
            quantity: data.quantity,
            product: {...data.productId._doc}
          };
        });
        const order = new Order({
          user: {
            email: req.user.email,
            address: req.user.address,
            userId: req.user
          },
          date: today,
          products: products,
          orderPrice: req.user.cart.totalPrice,
          ready: false,
          shipped: false,
          arrived: false
        })
        return order.save();
      })
      .then(result => {
        return req.user.clearCartAndEditPoints();
      })
      .then(result => {
        res.status(200).json({
          message: "Order Created Successfully",
          post: result
        })
      })
    })
    .catch(err => {
      console.log(err);
  })
}

// Change order ready to true
exports.readyTrue = (req, res, next) => {
  const orderId = req.body.orderId;
  Order.findByIdAndUpdate(orderId, {
    ready: true
  })
  .then(result => {
    res.status(200).json({
      message: "Order is Ready"
    })
  })
}

// Change order shipped to true
exports.shippedTrue = (req, res, next) => {
  const orderId = req.body.orderId;
  Order.findByIdAndUpdate(orderId, {
    ready: true,
    shipped: true
  })
  .then(result => {
    res.status(200).json({
      message: "Order Arrived Successfully"
    })
  })
}

// Change order arrived to true
exports.arrivedTrue = (req, res, next) => {
  const orderId = req.body.orderId;
  Order.findByIdAndUpdate(orderId, {
    ready: true,
    shipped: true,
    arrived: true
  })
  .then(result => {
    res.status(200).json({
      message: "Order Arrived Successfully"
    })
  })
}

// Fetch order data (view orders)
exports.getAllOrders = (req, res, next) => {
  Order.find()
    .then(orders => {
      res.status(200).json({
        message: "Orders fetched successfully",
        orders: orders
      })
    })
}

// Fetch order data (placed orders)
exports.getPlacedOrders = (req, res, next) => {
  Order.find({arrived: false})
    .then(orders => {
      res.status(200).json({
        message: "Orders fetched successfully",
        orders: orders
      })
    })
}

// fetch cart products
exports.getCartProducts = (req, res, next) => {
      User.findById(req.params.userId)
      .then(user => {
        req.user = user;
        const totalCartPrice = req.user.cart.totalPrice;
        req.user
          .populate("cart.items.productId")
          .execPopulate()
          .then(user => {
            const products = user.cart.items;
            res.status(200).json({
              message: "Fetched Cart Products Successfully",
              products: products,
              totalPrice: totalCartPrice
            })
          }) 
      })
      .catch(err => console.log(err));

}

// fetch wishlist products
exports.getWishlistProducts = (req, res, next) => {
  User.findById(req.params.userId)
      .then(user => {
        req.user = user;
        req.user
        .populate("wishList.items.productId")
        .execPopulate()
        .then(user => {
          const products = user.wishList.items;
          res.status(200).json({
            message: "Fetched Cart Products Successfully",
            products: products
          })
        })
      })
      .catch(err => console.log(err));

}


//fetch products
exports.getProducts=(req,res,next)=>{
  Product.find().then(products => {
      res.status(200).json({
          message: 'Fetched posts successfully.',
          products: products,
        });
    });  
}

//product details
exports.getProductById=(req,res,next)=>{
const id = req.body.id;
let productPriceInPoints;


Product.findById(id).then(product => {
  Point.findById("606b4859b8ef091944781576")
  .then(pointsDoc => {
    res.status(200).json({
        message: 'The Product is Fetched successfully.',
        product: product,
        productPriceInPoints: parseFloat(product.currentprice) * parseInt(pointsDoc.pointToEg)
      });
  })

  });  
}

exports.addProduct = (req, res, next) => {
    const title = req.body.title;
    const oldPrice = req.body.oldPrice;
    const newPrice = req.body.newPrice;
    const image = req.body.image;
    const brand = req.body.brand;
    const description = req.body.description;
    const mainCategory = req.body.mainCategory;
    
    const product = new Product({
      name: title,
      currentprice: newPrice,
      oldprice: oldPrice,
      description: description,
      image: image,
      brand: brand,
      mainCategory: mainCategory
    });

    product.save()
    .then(result=>{
        res.status(200).json({
            message: 'Added Product successfully.',
          });
      })
    .catch(err=>{console.log(err);});
  
};

//delete product
exports.deleteProductById = (req, res, next) => {
  const id = req.body.id;
  Product.findByIdAndDelete(id)
  .then(result=>{
      res.status(200).json({
          message: 'Deleted successfully.',
        });
    ;})
  .catch(err=>{console.log(err);});  
};

//update product
exports.updateProduct = (req, res, next) => {

  const id=req.body.id;
  const title=req.body.title;
  const oldPrice=req.body.oldPrice;
  const newPrice=req.body.newPrice;
  const image=req.body.image;
  const brand=req.body.brand;
  const description=req.body.description;
  const mainCategory=req.body.mainCategory;



  Product.findById(id)
    .then(product => {
      product.name = title;
      product.currentprice = newPrice;
      product.oldPrice = oldPrice;
      product.image = image;
      product.brand = brand;
      product.description = description;
      product.mainCategory = mainCategory;
      return product.save();
    }).then(result => {
      res.status(200).json({
          message: 'Updated successfully.',
        });
    })
    .catch(err => console.log(err));
 
};


  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    const productQty = req.body.productQty;
    const userId = req.body.userId;
    User.findById(userId)
      .then(user => {
        req.user = user;
        Product.findById(prodId)
        .then(product => {
          req.user.addToCart(product, productQty)
        })
        .then(result => {
          res.status(201).json({
            message: 'Product Added To Cart Successfully',
            post: result
          });
        })
      })
      .catch(err => console.log(err));

  }

  // Deletes a cart item
  exports.postDeleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    User.findById(req.body.userId)
    .then(user => {
      req.user = user;

      req.user
      .deleteItemFromCart(prodId)
      .then(result => {
        res.status(200).json({
          message: "Cart Item Deleted Successfully",
          post: result
        })
      })


    })
    .catch(err => console.log(err));
    
   
  }

  // Deletes a wishlist item
  exports.postDeleteWishlistItem = (req, res, next) => {
    const prodId = req.body.productId;

    User.findById(req.body.userId)
    .then(user => {
      req.user = user;

      req.user
      .deleteItemFromWishlist(prodId)
      .then(result => {
        res.status(200).json({
          message: "Wishlist Item Deleted Successfully",
          post: result
        })
      })

      
    })
    .catch(err => console.log(err));
 
  }
  
  // Decrease the quantity of one cart item
  exports.postDecreaseCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    User.findById(req.body.userId)
    .then(user => {
      req.user = user;

      Product.findById(prodId)
      .then(product => {
        req.user
          .deleteOneItemFromCart(product)
          .then(result => {
            res.status(200).json({
              message: "Cart Item Decreased Successfully",
              post: result
            })
          })
      })

      
    })
    .catch(err => console.log(err));


   
  }

  exports.postWishlist = (req, res, next) => {
    const prodId = req.body.productId;
    User.findById(req.body.userId)
    .then(user => {
      req.user = user;

      Product.findById(prodId)
      .then(product => {
        req.user.addToWishlist(product)
      })
      .then(result => {
        res.status(201).json({
          message: 'Product Added To Wishlist Successfully',
          post: result
        });
      })

      
    })
    .catch(err => console.log(err));

    }
    
    exports.postEditPoints = (req, res, next) => {
      const points = req.body.points;
      Point.updateOne({_id: "606b4859b8ef091944781576"}, {
        pointToEg: points
      })
      .then(result => {
        res.status(201).json({
          message: 'Points Updated Successfully',
          post: result
        })
      })
  }

//special products
exports.getSpecialProducts=(req,res,next)=>{
    Product.find({ $expr: { $gt: [ "$oldprice" , "$currentprice" ] } } ).then(products => {      
        res.status(200).json({
            message: 'Fetched products successfully.',
            products: products,
          });
      });  
  }


//search 
exports.getSearchProducts=(req,res,next)=>{
  const search=req.body.search;
  let Brand = {};
    //Product.find({ $or:[{'name':{ $regex : new RegExp(search, "i") }}, {'description':{ $regex : new RegExp(search, "i") }}, {'brand':{ $regex : new RegExp(search, "i") }} ]})
    //Product.find({ $or:[{'name':{ $exists: true, $in: [ search]} }, {'description':{ $exists: true, $in: [ search]} }, {'brand':{ $exists: true, $in: [ search]} } ]})
    Product.aggregate(
      [{ $match: { $or: [ {'name':{ $regex : new RegExp(search, "i") }}, {'description':{ $regex : new RegExp(search, "i") }}, {'brand':{ $regex : new RegExp(search, "i") }},{'mainCategory':{ $regex : new RegExp(search, "i") }} ] } } ]
    )
    .then(products => {
      products.forEach(function (a) {
        Brand[a.brand] = (Brand[a.brand] || 0) + 1;
    });    
    let brandkeys = [];
    let brandvalue = [];
    for (let key in Brand) {
      brandkeys.push(key);
      brandvalue.push(Brand[key]);
    }
    
        res.status(200).json({
            message: 'Fetched products successfully.',
            products: products,
            brandkey :brandkeys,
            brandvalue :brandvalue
          });
      });  
  }   


//navbar category 
exports.getSearchCategory=(req,res,next)=>{
  const category=req.body.category;
  let Brand = {};
    Product.aggregate(
      [{ $match: { 'mainCategory':{ $regex : new RegExp(category, "i") }}  } ]
    )
    .then(products => {
      products.forEach(function (a) {
        Brand[a.brand] = (Brand[a.brand] || 0) + 1;
    });    
    let brandkeys = [];
    let brandvalue = [];
    for (let key in Brand) {
      brandkeys.push(key);
      brandvalue.push(Brand[key]);
    }
    
        res.status(200).json({
            message: 'Fetched products successfully.',
            products: products,
            brandkey :brandkeys,
            brandvalue :brandvalue
          });
      });  
  }     



// signup
exports.postSignup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const address = req.body.address;
  
    User.findOne({email:email}).then(fetcheduser=>{
      if(fetcheduser){
        
          return res.status(422).send("This Email Is Already Exist!!");
      }

      else{

        return bcrypt.hash(req.body.password,10 ).then(
          hashPassword=>{
            const user =new User({
              username: username,
              email: email,
              password: hashPassword,
              points: 0,
              address: address,
              admin: false,
              cart:{items:[]},
              wishList:{items:[]}
            });
            return user.save();
          }
        )

    }
    }).then(r=>{
      res.status(200).json({
          message: 'Created The Account successfully.',
        });
    }).catch(err=>{console.log(err);});
    
  };
  
//login user  
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).send("This Email Is Not Exist!!");
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        return res.status(422).send("Wrong password!!");
      }
      if(loadedUser !=undefined){
        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
            points:loadedUser.points,
            username:loadedUser.username,
            admin:loadedUser.admin
          },
          'somesupersecretsecret',
          { expiresIn: '1h' }
        );
        res.status(200).json({ 
          token: token,
          userId: loadedUser._id.toString(),
          points:loadedUser.points,
          username:loadedUser.username,
          email:loadedUser.email,
          address:loadedUser.address,
          admin:loadedUser.admin });
      }
      
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.getToken = (req, res, next) => {
  const token= req.body.token;
  req.token=token;
}

exports.updateUserAddress = (req,res,next)=>{
  const id = req.body.id;
  const address = req.body.address;

  User.findById(id)
    .then(user => {

      user.address = address;

      return user.save();
    }).then(result => {
      res.status(200).json({
          message: 'Updated successfully.',
        });
    })
    .catch(err => console.log(err));
}




exports.getUserData = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      res.status(200).json({
        points: user.points, 
        username: user.username,
        email: user.email,
        userId: user._id,
        address: user.address
      })
    })
}

exports.getUserOrders = (req, res, next) => {
  const userId = req.params.userId;
  let username;
  User.findById(userId)
    .then(user => {
      username = user.username;
    })
    .then(result => {
      Order.find({"user.userId": userId})
      .then(orders => {
        res.status(200).json({
          message: "Fetched Orders Successfully",
          orders: orders,
          username: username
        });
      })
    })
    .catch(err => {
      console.log(err);
    })
}
 

exports.searchByImage = (req, res, next) => {
  // const dataset = [
  //   "data:image/jpeg;base64,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",
  //   "data:image/jpeg;base64,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",
  //   "data:image/jpeg;base64,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",
  //   "data:image/jpeg;base64,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"
  // ]
  
  const dataset = [];
  let searchResults;
  Product.find()
    .then(products => {
      return products.forEach(product => {
        dataset.push(product.image);
      });
    })
    .then(result => {
      const inputImage = req.body.inputImage;
      const pythonPath = "SearchByImage3/index.py";

      let options = {
          args: [
            JSON.stringify(dataset),
            JSON.stringify(inputImage)
          ]
        }
        pythonShell.PythonShell.run(pythonPath, options, function  (err, results)  {
          console.log(results);
          console.log("");
          console.log("");
          console.log("");
          // console.log(JSON.parse(results))
          searchResults = JSON.parse(results[0]);
          let productsList = [];

          for(let i=0; i<=searchResults.length; i++) {
            if(i < searchResults.length) {
              Product.find({image: searchResults[i].image})
              .then(products => {
                productsList.push(products[0]);
              })
            }
            else if(i == searchResults.length) {
              Product.find({image: searchResults[i-1].image})
              .then(results => {
                let Brand = {};
                productsList.forEach(function (a) {
                  Brand[a.brand] = (Brand[a.brand] || 0) + 1;
                });    
      
                let brandkeys = [];
                let brandvalue = [];
                for (let key in Brand) {
                  brandkeys.push(key);
                  brandvalue.push(Brand[key]);
                }
      
                res.status(200).json({
                  message: 'Fetched products successfully.',
                  products: productsList,
                  brandkey :brandkeys,
                  brandvalue :brandvalue
                });                
              })
            }
          }
        });
    })
}
