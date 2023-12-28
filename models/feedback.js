const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  /**
   * ID of user who submitted the feedback
   */
  userId: {
    type: String,
    desc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  },
  /**
   * type or category of feedback
   */
  category: {
    type: String,
    default: "bug report",
    required: true,
    enum: ["suggestion", "bug report", "complaint"]
  },
  /**
   * A short subject summarizing the feedback
   */
  subject: {
    type: String,
    required: true
  },
  /**
   * A detailed description providing context to feedback
   */
  description: {
    type: String,
    required: true
  },
  /**
   * Status of the feedback
   */
  status: {
    type: String,
    required: true,
    default: "open",
    enum: ["open", "in progress", "closed"]
  },
  /**
   * priority level of feedback
   */
  priority: {
    type: String,
    required: true,
    default: "low",
    enum: ["low", "medium", "high"]
  },
  /**
   * user's contact info
   */
  contact_info: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0.0
  }
});

module.exports = mongoose.model("feedback", feedbackSchema);