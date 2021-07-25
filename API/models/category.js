const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  children: [
    {
      type: String,
      required: false
    }
  ],
  isMainCategory: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Category', categorySchema);


// [
//   {
//     "name": "Home and Kitchen",
//     "children": [
//       "Home",
//       "Kitchen"
//     ],
//     "isMainCategory": true
//   },
//   {
//     "name": "Home",
//     "children": [],
//     "isMainCategory": false
//   },
//   {
//     "name": "Kitchen",
//     "children": [],
//     "isMainCategory": false
//   },

//   {
//     "name": "Supermarket",
//     "children": [],
//     "isMainCategory": true
//   },

//   {
//     "name": "Electronics",
//     "children": ["TVs", "PCs and PC Accessories", "Consoles", "Mobiles and Tablets", "Cameras"],
//     "isMainCategory": true
//   },
//   {
//     "name": "TVs",
//     "children": [],
//     "isMainCategory": false
//   },
//   {
//     "name": "PCs and PC Accessories",
//     "children": [],
//     "isMainCategory": false
//   },
//   {
//     "name": "Consoles",
//     "children": [],
//     "isMainCategory": false
//   },
//   {
//     "name": "Mobiles and Tablets",
//     "children": [],
//     "isMainCategory": false
//   },
//   {
//     "name": "Cameras",
//     "children": [],
//     "isMainCategory": false
//   },

//   {
//     "name": "Toys",
//     "children": [],
//     "isMainCategory": true
//   },

//   {
//     "name": "Sports",
//     "children": [],
//     "isMainCategory": true
//   },
//   {
//     "name": "Health and Beauty",
//     "children": [],
//     "isMainCategory": true
//   }
// ]