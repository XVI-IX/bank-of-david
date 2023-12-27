const express = require("express");
const router = express.Router();

const {
  getAccounts,
  addAccount,
  sendFunds,
  schedulePayment,
  getSchedules
} = require("../controllers/accounts");

router.get("/", getAccounts);
router.get("/:id", getAccountById);
router.put("/editAccount/:id", updateAccount);
router.delete("/deleteAccount/:id", deleteAccount);
// router.post("/", addAccount);

router.route("/:accountId/send").post(sendFunds);
router.route("/:accountId/schedule").post(schedulePayment);
router.route("/:accountId/schedule").get(getSchedules);


module.exports = router;