const express = require('express');
const router = express.Router();

const {
  addCard,
  getCards,
  deleteCard,
} = require("../controllers/cards");

router.post("/", addCard);
router.get("/", getCards)
router.delete("/:cardId", deleteCard);


module.exports = router;