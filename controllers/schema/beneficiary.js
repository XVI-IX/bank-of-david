const joi = require("joi");

const addBeneficiarySchema = joi.object().keys({
  fullName: joi.string().required(),
  accountNumber: joi.string().max(10).required(),
  bankName: joi.string().required(),
  bankBranch: joi.string(),
  country: joi.string().required(),
  currency: joi.string().default("Naira").required(),
  notes: joi.string(),
});

const updateBeneficiarySchema = joi.object().keys({
  fullName: joi.string().required(),
  accountNumber: joi.string().max(10).required(),
  bankName: joi.string().required(),
  bankBranch: joi.string(),
  country: joi.string().required(),
  currency: joi.string().default("Naira").required(),
  notes: joi.string()
})

module.exports = {
  addBeneficiarySchema,
  updateBeneficiarySchema
}