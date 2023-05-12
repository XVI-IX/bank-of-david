const express = require("express");
const router = express.Router();

const {
  getAccounts,
  addAccount,
} = require("../controllers/accounts");

router.route("/accounts").get(getAccounts);
router.route("/accounts").post(addAccount);

module.exports = router;