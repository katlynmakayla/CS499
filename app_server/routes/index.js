let express = require('express');
let router = express.Router();
const ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.index);
router.get('/login', (req, res) => {
    res.render('login', { title: 'Travlr Getaways - Login' });
});
module.exports = router;
