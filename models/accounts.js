require('dotenv').config();

const mongoose = require("mongoose");
const { faker } = require('@faker-js/faker');
const Customer = require('./user');
const { CardSchema } = require('./card');

const idSchema = new mongoose.Schema({
  idDocument: {
    type: String,
    default: "NIN",
    required: true,
    enum: ["Driver's License", "Passport", "NIN"]
  },
  idImage: {
    type: String,
    required: true,
  },
  verified: {
    type: String,
    required: true,
    default: false
  }
})

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
    default: async function() {
      const customer = await Customer.findById(this.customerId)
      return `${customer.firstName} ${customer.lastName}`
    }
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
  accountType: {
    type: String,
    default: 'Savings',
    required: true,
    enum: ['Savings', 'Current', 'Fixed']
  },
  card: {
    type: [CardSchema]
  },
  verified: {
    type: idSchema
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("account", AccountSchema);