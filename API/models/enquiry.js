const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const enquirySchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userEnquiry: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("Enquiry", enquirySchema);