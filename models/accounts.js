require('dotenv').config();

const mongoose = require("mongoose");
const { faker } = require('@faker-js/faker');
const User = require('./user');
const { CardSchema } = require('./card');

const AccountSchema = new mongoose.Schema({
  userId: {
    type: String, 
    desc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  accountName: {
    type: String,
    required: true,
    default: async function() {
      const user = await User.findById(this.userId)
      return `${user.firstName} ${user.lastName}`;
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
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("account", AccountSchema);
module.exports = AccountSchema;