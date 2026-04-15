let express = require('express');
let router = express.Router();
const controller = require('../controllers/register');

/* GET register page. */
router.get('/', controller.register);

module.exports = router;



