const express = require("express");
const router = express.Router();

router.post("/", addBeneficiary);
router.get("/", getBeneficiaries);
router.get("/:beneficiaryId", getBeneficiary);
router.put("/:beneficiaryId", updateBeneficiary);
router.delete("/:beneficiaryId", deleteBeneficiary);

module.exports = router;
