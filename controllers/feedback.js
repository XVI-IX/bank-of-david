const { feedbackSchema } = require("./schema");
const { Feedback, Notification } = require("../models");
const { StatusCodes } = require("http-status-codes");

const sendFeedback = async (req, res) => {
  try {
    const {
      category, subject,
      description, status,
      priority, contact_info,
      rating
    } = req.body;

    await feedbackSchema.validateAsync({
      category: category,
      subject: subject,
      description: description,
      status: status,
      priority: priority,
      contact_info: contact_info,
      rating: rating
    });

    const feedback = await Feedback.create({
      userId: req.session.userId,
      category: category,
      subject: subject,
      description: description,
      status: status,
      priority: priority,
      contact_info: contact_info,
      rating: rating
    });

    await Notification.create({
      message: subject,
      category: "Feedback",
      sender_info: contact_info
    });

    return res.status(StatusCodes.OK).json({
      message: "Feedback sent successfully",
      status: "success",
      statusCode: StatusCodes.OK,
      data: feedback
    });
  } catch (error) {
    console.error(error)

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: "error"
    })
  }
}

module.exports = {
  sendFeedback
}