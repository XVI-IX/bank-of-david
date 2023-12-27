const express = require('express');
const router = express.Router();

const { 
  getTransactions, getTransaction
  } = require('../controllers/transaction');

router.post("/send", send);
router.get("/", getTransactions);
router.get("/:transactionId", getTransaction);

module.exports = router;