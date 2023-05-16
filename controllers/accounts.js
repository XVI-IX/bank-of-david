const { Account, Transaction, Schedule } = require("../models")
const Redis = require("ioredis");
const redis = new Redis();

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../errors");
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

const sendFunds = async (req, res) => {

  const customerId = req.session.customerId;

  sessionExpired();

  const { 
    amount, accountNumber,
    account_bank, narration,
  } = req.body;
  
  const { accountId } = req.params;

  const preSend = await Account.findById(accountId);

  if (preSend.balance > amount) {
    try {
      const result = await send({
        "account_bank": account_bank,
        "account_number": accountNumber,
        "amount": amount,
        "narration": narration,
        "currency": "NGN",
        "debit_currency": "NGN"
      });
  
      await Account.findByIdAndUpdate(accountId, {
        "balance": preSend.balance - amount
      });
  
      const transaction = await Transaction.create({
        customerId,
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
  } else {
    return res.status( StatusCodes.BAD_REQUEST ).json({
      error: -1,
      msg: "Insufficient funds"
    })
  }
};

const schedulePayment = async (req, res) => {

  sessionExpired();

  const {
    schedule_name,
    schedule_date, amount,
    accountNumber, bankCode,
    fullName, bankName,
    frequency
  } = req.body;

  const customerId = req.session.customerId;
  const { accountId } = req.params;

  schedule_date = new Date(schedule_date);
  let minute = schedule_date.getMinutes();
  let hour = schedule_date.getHours();
  let day = schedule_date.getDays();

  const schedule = {
    schedule_name,
    accountId,
    customerId,
    schedule_date,
    amount,
    bankCode,
    accountNumber,
    bankName,
    fullName,
    frequency
  }

  const dataBody = {
    schedule_name,
    frequency,
    minute,
    hour,
    data: {
      accountId,
      amount,
      accountNumber,
      bankCode,
      fullName,
      bankName,
      "currency": "NGN",
      "debit_currency": "NGN"
    }
  }

  try {
    await Schedule.create({schedule});

    const exists = redis.exists("payment_schedules");

    if (exists === 1) {
      const schedules = await redis.get("payment_schedules");
      const data = JSON.parse(schedules);

      try {
        data.push(dataBody);
        await redis.set("payment_schedules", JSON.stringify(data))
      } catch (error) {
        console.error(error);
        return res.status( StatusCodes.BAD_REQUEST).json({
          success: false,
          msg: "Scheduling Failed"
        });
      }
    } else {
      const data = [];

      data.push(dataBody);

      await redis.set("payment_schedules", JSON.stringify(dataBody));
    }

    return res.status( StatusCodes.CREATED ).json({
      success: true,
      msg: "Schedule created successfully",
      data: {
        schedule_name,
        frequency,
        amount,
        accountNumber
      }
    })
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Schedule could not be processed");
  }
};

const getSchedules = async (req, res) => {
  const customerId = req.session.customerId;

  sessionExpired();

  try {
    const schedule = await Schedule.find({
      customerId,
      accountId: req.params.accountId
    })

    return res.status( StatusCodes.OK ).json({
      schedule
    })
  } catch (error) {
    throw new BadRequestError("Errorororororo");
  }
}

module.exports = {
  getAccounts,
  addAccount,
  sendFunds,
  schedulePayment,
  getSchedules
}