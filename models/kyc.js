const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  /**
   * ID of user adding kyc
   */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  /**
   * type of document submitted
   */
  documentType: {
    type: String,
    required: true,
    enum: ["passport", "driver's license", "NIN"]
  },
  /**
   * unique identification number associated with the document
   */
  documentNumber: {
    type: String,
    required: true,
  },
  /**
   * KYC verification status
   */
  verificationStatus: {
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "approved", "rejected"]
  },
  /**
   * user's residential address
   */
  residentialAddress: {
    type: String,
    required: true,
  },
  /**
   * reference to image documenting user's proof of address
   */
  proofOfAddress: {
    type: String,
  },
  /**
   * KYC tier which the user belongs
   */
  tier: {
    type: String,
    required: true,
    default: 'Tier 1',
    enum: ["Tier 1", "Tier 2", "Tier 3"]
  },
  /**
   * transfer limit associated with tier level
   */
  limit: {
    type: Number,
    required: true,
    default: function () {
      switch (this.tier) {
        case "Tier 1":
          return 50000
        case "Tier 2":
          return 500000
        case "Tier 3":
          return 2000000
        default:
          return 0
      }
    }
  }
})

module.exports = mongoose.model("kyc", kycSchema);