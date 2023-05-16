const express = require('express');
const router = express.Router();

const { 
  getTransactions, getTransaction
  } = require('../controllers/transaction');

router.route("/").get(getTransactions);
router.route("/:transactionId").get(getTransaction);

module.exports = router;