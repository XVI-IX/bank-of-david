const { Transaction, Account, Schedule } = require("../models");

const Redis = require("ioredis");
const redis = new Redis();
const cron = require("node-cron");


const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../../Jobs api/errors");
const { sessionExpired } = require("../functions");
const send = require("../functions/sendFunds");

const getTransactions = async (req, res) => {
  const customerId = req.session.customerId;

  sessionExpired();

  const transactions = await Transaction.find({customerId});

  res.status( StatusCodes.OK ).json({
    transactions
  })
};

const getTransaction = async (req, res) => {
  const customerId = req.session.customerId;
  const transactionId = req.params.transactionId;

  sessionExpired();

  const transaction = await Transaction.findById(transactionId);

  if (transaction) {
    if (transaction.customerId === customerId) {
      return res.status( StatusCodes .OK).json({
        transaction
      });
    } else {
      throw new UnauthenticatedError("Invalid Customer");
    }
  } else {
    throw new NotFoundError("Transaction record not found");
  }
}

module.exports = {
  getTransactions,
  getTransaction,
}