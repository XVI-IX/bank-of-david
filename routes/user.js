const express = require('express');
const router = express.Router();

const { getCustomerProfile, 
  editCustomerProfile,
  getBalance,} = require("../controllers/user");

router.get("/profile", getCustomerProfile);
router.put("/profile", editCustomerProfile);
router.get("/accounts", getAccounts);
router.get("/transactions", getTransactions)


module.exports = router;