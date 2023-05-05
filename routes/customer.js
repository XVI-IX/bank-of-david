const express = require('express');
const router = express.Router();

const { getCustomerProfile, 
  editCustomerProfile,
  getAccounts } = require("../controllers/customer");

router.route("/").get(getCustomerProfile);
router.route("/accounts").get(getAccounts);
router.route("/").patch(editCustomerProfile);

module.exports = router;