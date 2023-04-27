const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  accountId: {
    type: String,
    desc: {
      type: mongoose.Types.ObjectId,
      ref: "account"
    }
  },
  cardId: {
    type: String,
    desc: {
      type: mongoose.Types.ObjectId,
      ref: "card"
    }
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
    required: true
  },
  to: {
    type: String,
    required: true
  },
  from: {
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
  }
})

module.exports = mongoose.model('transaction', TransactionSchema);