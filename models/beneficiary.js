const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  /**
   * id of user adding beneficiary
   */
  userId: {
    type: String,
    desc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  },
  /**
   * full name of the beneficiary
   */
  fullName: {
    type: String,
    required: true
  },
  /**
   * Account number of beneficiary
   */
  accountNumber: {
    type: String,
    required: true,
    max_length: 10
  },
  /**
   * bank name of beneficiary's account number
   */
  bankName: {
    type: String,
    required: true,
  },
  /**
   * bank branch
   */
  bankBranch: {
    type: String
  },
  /**
   * country of bank
   */
  country: {
    type: String,
    required: true
  },
  /**
   * currency which the bank account accepts
   */
  currency: {
    type: String,
    required: true
  },
  /**
   * Additional note or comment related to the beneficiary
   */
  notes: {
    type: String,
  }
}, {
  timestamps: true
})