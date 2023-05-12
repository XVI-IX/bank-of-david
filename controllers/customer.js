const { Customer, Account, Card } = require("../models");

const Redis = require("ioredis");
const redis = new Redis();

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../../Jobs api/errors");
const { sessionExpired } = require("../functions");

const getCustomerProfile = async (req, res) => {
  const customer = req.customer;
  const idString = String(customer._id)

  // console.log(customer);
  if (req.session.customerId) {
    const exists = await redis.exists(idString);

    if (exists === 1) {
      let data = await redis.get(idString);
      data = JSON.parse(data);

      console.log("From redis");

      res.status(StatusCodes.OK).json({
        data
      });
      return;
    } else {
      const data = await Customer.findById(customer._id).select("-password");

      if (!data) {
        throw new NotFoundError("Customer not found");
      }

      await redis.set(idString, JSON.stringify(data), 'ex', 720);

      res.status(StatusCodes.OK).json({
        data
      });
    }
  }

  throw new UnauthenticatedError("Session Expired, Login");
}

const editCustomerProfile = async (req, res) => {
  const { phoneNumber, email} = req.body;

  // console.log(req.session.customerId);
  sessionExpired();

  const customer = await Customer.findOne({ _id: req.session.customerId });
  if (!customer) {
    throw new NotFoundError("Customer Not Found");
  }

  const compare = await customer.comparePassword(req.body.password);
  if (!compare) {
    throw new UnauthenticatedError("Invalid password");
  }

  try {
    console.log("try block")
    await Customer.findOneAndUpdate({
      _id: customer._id
    }, {
      email: email,
      phoneNumber: phoneNumber
    }, {
      new: true,
      runValidators: true
    });
    // console.log("updated");
    res.status( StatusCodes.OK ).json({
      msg: "Profile updated",
      success: true
    });
  } catch (error) {
    console.log(error.message);
    throw new BadRequestError("Could not update customer data");
  }
};

const getBalance = async (req, res) => {
  const customerId = req.session.customerId;

  sessionExpired();

  try {
    const accounts = await Account.find({customerId: customerId});
    let balance = 0;
  
    for (let account of accounts) {
      balance += account.balance;
    }
  
    res.status( StatusCodes.OK ).json({
      balance: balance
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Please try again");
  }
}


module.exports = {
  getCustomerProfile,
  editCustomerProfile,
  getBalance,
}
