const express = require('express');
const router = express.Router();

const { getCustomerProfile, 
  editCustomerProfile,
  getAccounts, 
  getCards,
  addCard} = require("../controllers/customer");

router.route("/").get(getCustomerProfile);
router.route("/accounts").get(getAccounts);
router.route("/accounts/:accountId").post(addCard);
router.route("/").patch(editCustomerProfile);
router.route("/accounts/:accountId/cards").get(getCards)


module.exports = router;