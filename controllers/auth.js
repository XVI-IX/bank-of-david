const { StatusCodes } = require("http-status-codes");
const { Customer } = require("../models");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { NotFoundError } = require("../../Jobs api/errors");

const signup = async (req, res) => {
  console.log(req.body);
  const customer = await Customer.create({ ...req.body });
  const token = customer.createJWT();

  res.status(StatusCodes.CREATED).json({
    customer: {
      name: customer.userName,
    },
    token
  });
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }

  const customer = await Customer.findOne({ email});
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

const testing = (req, res) => {
  res.send("Testing route");
}


module.exports = {
  signup,
  login,
  testing
}