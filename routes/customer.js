const express = require('express');
const router = express.Router();

const { getCustomerProfile, 
  editCustomerProfile,
  getBalance,} = require("../controllers/customer");

router.route("/").get(getCustomerProfile);
router.route("/").patch(editCustomerProfile);
router.route("/balance").get(getBalance);


module.exports = router;