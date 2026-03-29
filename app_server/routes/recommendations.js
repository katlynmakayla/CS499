const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommendations');

router.get('/', controller.recommendations); 

module.exports = router;
