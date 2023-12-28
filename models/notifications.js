const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  /**
   * main content of the notification message
   */
  message: {
    type: String,
    required: true,
  },
  /**
   * type or category of the notification
   */
  category: {
    type: String,
    required: true,
    enum: ["Transaction", "Security Alert", "Account Update"],
    default: "Account Update"
  },
  /**
   * Indication of whether user has read the notification
   */
  status: {
    type: String,
    required: true,
    default: "Unread",
    enum: ["Read", "Unread"]
  },
  /**
   * Priority level of notification
   */
  priority: {
    type: String,
    required: true,
    default: "low",
    enum: ["high", "medium", "low"]
  },
  /**
   * Entity triggering the notification
   */
  sender_info: {
    type: String,
    required: true,
    default: "System",
    enum: ["System", "Transaction processing"]
  },
  /**
   * an expiration date after which the notification may no longer be relevant.
   */
  expiration_date: {
    type: Date,
    required: true,
  }
})

module.exports = mongoose.model('Notification', notificationSchema);