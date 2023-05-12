const Account = require("../models");

const Redis = require("ioredis");
const redis = new Redis();

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../../Jobs api/errors");
const { sessionExpired } = require("../functions");

const getAccounts = async (req, res) => {
  const customerId = req.session.customerId;

  sessionExpired();

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

const addAccount = async (req, res) => {
  const customerId = req.session.customerId;
  const {
    accountNumber,
    currency,
  } = req.body;

  try {
    await Account.create({
      customerId: customerId,
      accountNumber,
      currency
    });
  
    res.status( StatusCodes.CREATED ).json({
      success: true,
      msg: "Account added successfully"
    })
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Operation Failed");
  }
};


module.exports = {
  getAccounts,
  addAccount
}