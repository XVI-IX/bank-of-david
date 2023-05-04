require('dotenv').config();

const { UnauthenticatedError } = require("../errors");
const { Customer } = require("../models");
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = authHeader.split(" ")[1];
  console.log(token);

  try {
    const payload = await jwt.verify(token, process.env.SECRET);

    console.log(payload);

    const customer = await Customer.findById(payload.userId).select(
      '-password -address -age -phoneNumber -bvn -postalCode'
    );
    
    console.log(customer);
    req.customer = customer;

    next();
  } catch (error) {
    console.log(error.message);
    throw new UnauthenticatedError("Invalid Credentials");
  }
}

module.exports = auth;