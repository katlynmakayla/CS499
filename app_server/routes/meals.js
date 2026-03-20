let express = require('express');
let router = express.Router();
const controller = require('../controllers/meals');

/* GET meals page. */
router.get('/', controller.meals);

module.exports = router;
