const mongoose = require('mongoose');
const Product = require("./product");
const Point = require("./points");


const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true,
    default: 0
  },
  admin: {
    type: Boolean,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ],
    totalPrice: {
      type: Number,
      require: true,
      default: 0
    }
  },
  wishList: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
      }
    ]
  },
});


userSchema.methods.addToCart = function(product, productQty) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });

  const oldTotalPrice = (this.cart.totalPrice) ? this.cart.totalPrice: 0

  let updatedTotalPrice = oldTotalPrice;

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  
  if(cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + parseInt(productQty);
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedTotalPrice += parseFloat(product.currentprice) * parseInt(productQty);
    
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: parseInt(productQty)
    })
    updatedTotalPrice += parseFloat(product.currentprice) * parseInt(productQty);
  }

  const updatedCart = {
    items: updatedCartItems,
    totalPrice: updatedTotalPrice
  }

  this.cart = updatedCart;
  return this.save();

}

// Decrease the quantity by one
userSchema.methods.deleteOneItemFromCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });

  const oldTotalPrice = (this.cart.totalPrice) ? this.cart.totalPrice: 0
  let updatedTotalPrice = oldTotalPrice;
  const updatedCartItems = [...this.cart.items];
  
  newQuantity = this.cart.items[cartProductIndex].quantity - 1;
  updatedCartItems[cartProductIndex].quantity = newQuantity;
  updatedTotalPrice -= parseFloat(product.currentprice)

  if(newQuantity == 0) {
      const productPrice = parseFloat(product.currentprice);
      let updatedTotalPrice = (oldTotalPrice - productPrice ).toFixed(2);        
      const updatedCartItems = this.cart.items.filter(p => {
        return p.productId.toString() !== product._id.toString();
      });
      const updatedCart = {
        items: updatedCartItems,
        totalPrice: updatedTotalPrice
      };

      this.cart = updatedCart;
      return this.save();
  } else {
    if(updatedTotalPrice < 0)
      updatedTotalPrice = 0;
  
    const updatedCart = {
      items: updatedCartItems,
      totalPrice: updatedTotalPrice
    }
  
    this.cart = updatedCart;
    return this.save();
  }
}


userSchema.methods.deleteItemFromCart = function(prodId) {
  const oldTotalPrice = this.cart.totalPrice;
  const productQuantity = this.cart.items.find(product => {
    return product.productId.toString() === prodId.toString();
  }).quantity;
  
  return Product.findById(prodId)
    .then(product => {
      const productPrice = parseFloat(product.currentprice);
      let updatedTotalPrice = (oldTotalPrice - (productPrice * productQuantity)).toFixed(2);
      if(updatedTotalPrice < 0)
        updatedTotalPrice = 0;
      const updatedCartItems = this.cart.items.filter(p => {
        return p.productId.toString() !== prodId.toString();
      });
      const updatedCart = {
        items: updatedCartItems,
        totalPrice: updatedTotalPrice
      };

      this.cart = updatedCart;
      return this.save();
    });
}

userSchema.methods.clearCartAndEditPoints = function() {
  const price = this.cart.totalPrice;
  this.cart = {
    items: [],
    totalPrice: 0
  }

  const oldPoints = this.points;
  let updatedPoints;
  Point.findById("606b4859b8ef091944781576")
  .then(pointsDoc => {
    updatedPoints = parseInt(oldPoints) + parseInt(price / (pointsDoc.pointToEg));
    this.points = updatedPoints;
    return this.save();
  })

}

userSchema.methods.deleteItemFromWishlist = function(prodId) {
  return Product.findById(prodId)
    .then(product => {
      const updatedWishlistItems = this.wishList.items.filter(p => {
        return p.productId.toString() !== prodId.toString();
      });
      const updatedWishlist = {
        items: updatedWishlistItems
      };

      this.wishList = updatedWishlist;
      return this.save();
    });
}

userSchema.methods.addToWishlist= function(product) {
  const updatedwishListItems = [...this.wishList.items];
  let productInWishlist = false;

  for(let item of updatedwishListItems) {
    if(item.productId.toString() === product._id.toString())
      productInWishlist = true;
  }

  if(!productInWishlist) {
    updatedwishListItems.push({
      productId: product._id
    });
  }

  const updatedwishList= {
    items: updatedwishListItems
  }

  this.wishList= updatedwishList
  return this.save();

}


module.exports = mongoose.model('User', userSchema);
