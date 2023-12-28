const express = require("express");
const router = express.Router();
const {
  addBeneficiary,
  getBeneficiary,
  getBeneficiaries,
  updateBeneficiary,
  deleteBeneficiary
} = require("../controllers/beneficiary")

router.post("/", addBeneficiary);
router.get("/", getBeneficiaries);
router.get("/:beneficiaryId", getBeneficiary);
router.put("/:beneficiaryId", updateBeneficiary);
router.delete("/:beneficiaryId", deleteBeneficiary);

module.exports = router;
