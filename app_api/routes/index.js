const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const jwt = require('jsonwebtoken'); // enable json web tokens

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    // console.log('In Middleware');
    const authHeader = req.headers['authorization'];
    // console.log('Auth Header: ' + authHeader);
    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }
    let headers = authHeader.split(' ');
    if (headers.length < 1) {
        console.log('Not enough tokens in Auth Header: ' +
            headers.length);
        return res.sendStatus(501);
    }
    const token = authHeader.split(' ')[1];
    // console.log('Token: ' + token);
    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }
    // console.log(process.env.JWT_SECRET);
    // console.log(jwt.decode(token));
    /*
    // I had warnings to remove this unecessary code
    const verified = jwt.verify(token, process.env.JWT_SECRET, (err,
        verified) => {
        if (err) {
            return res.sendStatus(401).json('Token Validation Error!');
        }
        req.auth = verified; // Set the auth paramto the decoded object
    });
    */
    next(); // We need to continue or this will hang forever
}



// Define the route for user registration and login
router
    .route('/register')
    .post(authController.register);
router.route('/login')
    .post(authController.login);

// Define the route for getting the list of trips
router
    .route('/trips')
    .get(tripsController.tripsList) // GET Method routes Trip List
    .post(authenticateJWT, tripsController.tripsAddTrip); // POST Method routes Trip Add

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET Method routes Trip by Code
    .put(authenticateJWT, tripsController.tripsUpdateTrip) // PUT Method routes Trip Update
    .delete(authenticateJWT, tripsController.tripsDeleteTrip); // DELETE Method routes Trip Delete

// export the router
module.exports = router;