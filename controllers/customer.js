const { Customer } = require("../models");

const Redis = require("ioredis");
const redis = new Redis();

const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getCustomerProfile = async (req, res) => {
  const customer = req.customer;
  const idString = String(customer._id)

  // console.log(customer);

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

const editCustomerProfile = async (req, res) => {
  const params = { ...req.params }

  res.send(params);
  console.log(params);
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