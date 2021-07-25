const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pointsSchema = new Schema({
    // The amount of point earned for each 1 pound.
  pointToEg: {
    type: Number,
    required: true,
    default: 10
  }
});

// pointsSchema.methods.convertPoundsToPoints = function(price) {
//     console.log(price * this.egToPoint);
//     return price * this.egToPoint;
// }

// pointsSchema.methods.editPoints = function(newPointsValue) {
//     this.egToPoint = newPointsValue;
//     return this.save();
// }

module.exports = mongoose.model('Point', pointsSchema);