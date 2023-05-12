const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  accountId: {
    type: String,
    desc: {
      type: mongoose.Types.ObjectId,
      ref: "account"
    }
  },
  customerId: {
    type: String,
    desc: {
      type: mongoose.Types.ObjectId,
      ref: "customer"
    }
  },
  cardId: {
    type: String,
    desc: {
      type: mongoose.Types.ObjectId,
      ref: "card"
    },
    default: null,
  },
  date: {
    type: Date,
    default: new Date()
  },
  amount: {
    type: Number,
    required: [true, "Please provide amount"],
  },
  transType: {
    type: String,
    enum: ["debit", "credit"],
    required: true,
    default: "debit"
  },
  accountNumber: {
    type: String,
    required: true
  },
  bankCode: {
    type: Number,
    required: true,
  },
  fullName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: function () {
      if (this.transType === "debit") {
        return `Transfer to ${this.to}`
      }
      return `Recieved from ${this.from}`;
    },
    maxlength: 50
  },
  fees: {
    type: Number,
    default: 0.00
  },
  reference: {
    type: String,
    required: true,
  },
  bankName: {
    required: true,
    type: String
  }
})

module.exports = mongoose.model('transaction', TransactionSchema);