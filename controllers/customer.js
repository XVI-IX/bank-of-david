const { Customer } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getProfile = async (req, res) => {
  const customer = req.customer;

  const data = await Customer.findById(customer._id).select("-password");

  if (!data) {
    throw new NotFoundError("Customer not found");
  }

  res.status(StatusCodes.OK).json({
    data
  })
}

module.exports = {
  getProfile,
}