const { Transaction } = require("../models");

const Redis = require("ioredis");
const redis = new Redis();

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../../Jobs api/errors");
const customer = require("../models/customer");
const send = require("../functions/sendFunds");

const getTransactions = async (req, res) => {
  const customerId = req.session.customerId;

  if (!customerId) {
    throw new UnauthenticatedError("Please Log in");
  }

  const transactions = await Transaction.find({customerId});

  res.status( StatusCodes.OK ).json({
    transactions
  })
};


const getTransaction = async (req, res) => {
  const customerId = req.session.customerId;
  const transactionId = req.params.transactionId;

  if (!customerId) {
    throw new UnauthenticatedError("Please log in");
  }

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
const sendFunds = async (req, res) => {
  const { 
    amount, accountNumber,
    account_bank, narration,
    accountId
  } = req.body;

  try {
    const result = await send({
      "account_bank": account_bank,
      "account_number": accountNumber,
      "amount": amount,
      "narration": narration,
      "currency": "NGN",
      "debit_currency": "NGN"
    });
    const transaction = await Transaction.create({
      customerId: req.session.customerId,
      accountId: accountId,
      amount: result.amount,
      accountNumber: result.accountNumber,
      bankCode: result.account_bank,
      description: result.narration,
      fees: result.fee,
      bankName: result.bank_name,
      fullName: result.full_name,
    });

    res.status( StatusCodes.OK ).json({
      transaction
    });
  } catch (error) {
    console.log(error)
  }
};


module.exports = {
  getTransactions,
  getTransaction,
  sendFunds,
}