const express = require('express');
const router = express.Router();

const { getTransactions, getTransaction, sendFunds } = require('../controllers/transaction');

router.route("/").get(getTransactions);
router.route("/:transactionId").get(getTransaction);
router.route("/send").post(sendFunds);

module.exports = router;