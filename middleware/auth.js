require('dotenv').config();

const { UnauthenticatedError, BadRequestError } = require("../errors");
const { Customer } = require("../models");
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.SECRET);

    const customer = await Customer.findById(payload.userId).select(
      '-password -address -age -phoneNumber -bvn -postalCode'
    );

    req.customer = customer;

    next();
  } catch (error) {
    console.log(error.message);
    throw new UnauthenticatedError("Invalid Credentials");
  }
}

auth.catch(error => {
  throw new BadRequestError(error);
})

module.exports = auth;