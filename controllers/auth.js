const { StatusCodes } = require("http-status-codes");
const { Customer } = require("../models");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { NotFoundError } = require("../../Jobs api/errors");

const signup = async (res, req) => {
  const customer = await Customer.create({ ...req.body });
  const token = customer.createJWT();

  res.status(StatusCodes.CREATED).json({
    customer: {
      name: customer.userName,
    },
    token
  });
}

const login = async (res, req) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }

  const customer = Customer.findOne({ email});
  if (!customer) {
    throw new NotFoundError("Customer could not be found");
  }

  const compare = await customer.comparePassword(password);
  if (!compare) {
    throw new UnauthenticatedError("Invalid Password");
  }

  const token = customer.createJWT();

  res.status(StatusCodes.OK).json({
    customer: {
      userName: customer.userName,
    },
    token
  })
}


module.exports = {
  signup,
  login,
}