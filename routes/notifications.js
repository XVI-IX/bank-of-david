const express = require('express');
const router = express.Router();

router.get('/', getNotifications);
router.put('/:notifications/:notificaitonId', updateNotification);

module.exports = router;