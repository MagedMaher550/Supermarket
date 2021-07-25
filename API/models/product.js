const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  oldprice: {
    type: Number,
    required: true
  },
  currentprice: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: false
  },
  mainCategory: {
    type: String,
    ref: "Category",
    required: false
  }
});

module.exports = mongoose.model('Product', productSchema);