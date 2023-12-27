const express = require("express");
const router = express.Router();

const {
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  sendFunds,
  schedulePayment,
  getSchedules
} = require("../controllers/accounts");

router.post("/", createAccount);
router.get("/", getAccounts);
router.get("/:accountId", getAccountById);
router.put("/editAccount/:accountId", updateAccount);
router.delete("/deleteAccount/:accountId", deleteAccount);



module.exports = router;