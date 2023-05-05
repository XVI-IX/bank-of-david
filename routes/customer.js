const express = require('express');
const router = express.Router();

const { getCustomerProfile, editCustomerProfile } = require("../controllers/customer");

router.route("/").get(getCustomerProfile);
router.route("/:_id").patch(editCustomerProfile);

module.exports = router;