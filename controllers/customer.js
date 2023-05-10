const { Customer, Account, Card } = require("../models");

const Redis = require("ioredis");
const redis = new Redis();

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../../Jobs api/errors");
const customer = require("../models/customer");

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
  if (!req.session.customerId) {
    throw new UnauthenticatedError("Session Expired");
  }

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

const getAccounts = async (req, res) => {
  const customerId = req.session.customerId;

  if (!customerId) {
    throw new UnauthenticatedError("Please log in");
  };

  try {
    const exists = await redis.exists(`${customerId}accounts`);

    if (exists === 1) {
      let data = await redis.get(`${customerId}accounts`);

      console.log("From redis");

      res.status(StatusCodes.OK).json({
        data
      });
      return;
    } else {
      const accounts = await Account.find({customerId: customerId});

      console.log(accounts);

      if (!accounts) {
        throw new NotFoundError("Customer  accounts not found");
      }

      await redis.set(`${customerId}accounts`, JSON.stringify(accounts), 'ex', 720);

      res.status(StatusCodes.OK).json({
        accounts
      });
    }
  } catch (error) {
    res.status( StatusCodes.BAD_GATEWAY).json({
      error: -1,
      msg: "Error, try again"
    });
  }
};

const getCards = async (req, res) => {
  const customerId = req.session.customerId;
  const accountId = req.params.accountId;

  if (!customerId) {
    throw new UnauthenticatedError("Please Log in");
  }
  const cards = await Card.findOne({ accountId: accountId})
                          .select("-cvv -cardNumber");
  
  if (!cards) {
    return res.status( StatusCodes.NOT_FOUND).json({
      msg: "No Cards found for this customer"
    })
  }

  return res.status( StatusCodes.OK ).json({
    cards
  });
};

const addCard = async (req, res) => {
  const customerId = req.session.customerId;
  const accountId = req.params.accountId;

  if (!customerId) {
    throw new UnauthenticatedError("Please log in");
  }

  req.body['accountId'] = accountId;
  const card = await Card.create({...req.body});

  if (!card) {
    return res.status( StatusCodes.BAD_GATEWAY ).json({
      error: -1,
      msg: "Card details not saved"
    });
  }

  res.status( StatusCodes.OK ).json({
    msg: "Card saved successfully"
  });
};
// const deleteCard;
// const editCard;


// const getInfo


module.exports = {
  getCustomerProfile,
  editCustomerProfile,
  getAccounts,
  getCards,
  addCard
}
