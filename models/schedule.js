const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  schedule_name: {
    type: String,
    required: [true, "Please provide a schedule name"]
  },
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
  created_at: {
    type: Date,
    default: new Date()
  },
  modified_at: {
    type: Date,
    default: new Date()
  },
  schedule_date: {
    type: Date,
    required: [true, "Please enter a schedule date"]
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
  bankName: {
    required: true,
    type: String
  },
  frequency: {
    type: String,
    required: [true, "Please provide the schedule frequency"]
  }
})

module.exports = mongoose.model('schedules', ScheduleSchema);