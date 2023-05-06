require('dotenv').config();

const mongoose = require("mongoose");
const { faker } = require('@faker-js/faker');

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
  },
  accountNumber: {
    type: Number,
    required: true,
    default: faker.finance.account(10),
    unique: true,
  },
  balance: {
    type: Number,
    default: 0.00,
    
  },
  currency: {
    type: String,
    default: 'NGN',
    required: true,
    enum: ['NGN', 'USD', 'EUR', 'GBP']
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