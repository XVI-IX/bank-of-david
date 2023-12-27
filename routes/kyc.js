const express = require('express');
const router = express.Router();

router.post('/upload-document', uploadDocument);
router.get('/status', kycStatus);

module.exports = router;