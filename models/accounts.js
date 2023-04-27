require('dotenv').config();

const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  customerId: {
    type: String, 
    desc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer'
    }
  },
  accountName: {
    type: String,
    required: true,
    maxlength: 15
  },
  balance: {
    type: Number,
    default: 0.00,
    
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  modifiedAt: {
    type: Date,
    default: new Date()
  }
})

module.exports = mongoose.model("account", AccountSchema);