const joi = require("joi");

const categories = ["suggestion", "bug report", "complaint"];
const status = ["open", "in progress", "closed"];
const priorities = ["low", "medium", "high"];

const feedbackSchema = joi.object().keys({
  category: joi.string().valid(...categories).required(),
  subject: joi.string().required(),
  description: joi.string().required(),
  status: joi.string().valid(...status).default("open").required(),
  priority: joi.string().valid(...priorities).default("low").required(),
  contact: joi.string().required(),
  rating: joi.number().default(0.0)
})

module.exports = feedbackSchema