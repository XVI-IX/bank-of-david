const express = require('express');
const router = express.Router();

const {
  addCard,
  getCards,
  deleteCard,
} = require("../controllers/cards");

router.route("/").post(addCard);
router.route("/").get(getCards)
router.route("/:cardId").delete(deleteCard)


module.exports = router;