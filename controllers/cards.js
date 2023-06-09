const {Card} = require("../models");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { sessionExpired } = require("../functions");

const getCards = async (req, res) => {
  const accountId = req.params.accountId;

  if (!req.session.customerId) {
    throw new UnauthenticatedError("Session Expired");
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
  const accountId = req.params.accountId;

  if (!req.session.customerId) {
    throw new UnauthenticatedError("Session Expired");
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
    msg: "Card saved successfully",
    success: true
  });
};

const deleteCard = async (req, res) => {
  const accountId = req.params.accountId;
  const cardId = req.params.cardId;

  if (!req.session.customerId) {
    throw new UnauthenticatedError("Session Expired");
  }

  try {
    await Card.deleteOne({
      _id: cardId,
      accountId: accountId
    });

    return res.status( StatusCodes.OK ).json({
      msg: "Deleted Successfully",
      success: true
    })
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Please try again");
  }
};


module.exports = {
  deleteCard,
  addCard,
  getCards
}