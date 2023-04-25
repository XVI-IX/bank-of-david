require('dotenv').config();

const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: {
    type: String, 
    desc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  balance: {
    type: Number,
    default: 0.00,
    
  }
})