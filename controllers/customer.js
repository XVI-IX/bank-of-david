const { Customer } = require("../models");

const Redis = require("ioredis");
const redis = new Redis();

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../../Jobs api/errors");

const getCustomerProfile = async (req, res) => {
  const customer = req.customer;
  const idString = String(customer._id)

  // console.log(customer);
  if (req.session._id) {
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

      await redis.set(idString, JSON.stringify(data));

      res.status(StatusCodes.OK).json({
        data
      });
    }
  }

  throw new UnauthenticatedError("Session Expired, Login");

}

const editCustomerProfile = async (req, res) => {
  const { phoneNumber, email} = req.body;

  const customer = await Customer.findOne({ _id: req.session._id });
  if (!customer) {
    throw new UnauthenticatedError("Session Expired");
  }

  const compare = await customer.comparePassword(req.body.password);

  if (!compare) {
    throw new UnauthenticatedError("Invalid password");
  }
  try {
    await Customer.findOneAndUpdate({
      _id: customer._id
    }, {
      email: email,
      phoneNumber: phoneNumber
    })

    res.status( Status.OK ).json({
      msg: "Profile updated",
      success: true
    });
  } catch (error) {
    throw new BadRequestError("Could not update customer data");
  }

  res.send({ phoneNumber, email });
  console.log(phoneNumber, email);
};

// const getAccounts;

// const getCards;
// const deleteCard
// const editCard;


// const getInfo


module.exports = {
  getCustomerProfile,
  editCustomerProfile,
}