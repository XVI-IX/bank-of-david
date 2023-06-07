const { Transaction } = require("../models");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const { UnauthenticatedError } = require("../errors");
const { sessionExpired } = require("../functions");

const getTransactions = async (req, res) => {
  const customerId = req.session.customerId;

  if (!req.session.customerId) {
    throw new UnauthenticatedError("Session Expired");
  }

  const transactions = await Transaction.find({customerId});

  if (!transactions) {
    return res.status( StatusCodes.NOT_FOUND ).json({
      error: -1,
      msg: "No transactions found for user"
    })
  }

  res.status( StatusCodes.OK ).json({
    transactions
  })
};

const getTransaction = async (req, res) => {
  const customerId = req.session.customerId;
  const transactionId = req.params.transactionId;

  if (!req.session.customerId) {
    throw new UnauthenticatedError("Session Expired");
  }

  const transaction = await Transaction.findById(transactionId);

  if (transaction) {
    if (transaction.customerId === customerId) {
      return res.status( StatusCodes.OK ).json({
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