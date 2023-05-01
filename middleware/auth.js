require('dotenv').config();

const { UnauthenticatedError } = require("../errors");
const { Customer } = require("../models");
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = authHeader.split()[1];

  try {
    const payload = jwt.verify(token, process.env.SECRET);

    const customer = await Customer.findById(payload._id).select(
      '-password -address -age -phoneNumber -bvn -postalCode');
    req.customer = customer;

    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
}

module.exports = auth;