const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('Trip');

// Get: /trips - lists all trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model
        .find() // return all trips
        .exec();
  
        // uncomment this to show results in the console or comment to hide
        //console.log(q); 

    if (!q || q.length === 0) { // if there are no trips
        // database returned no data
        return res
            .status(404) // 404 Not Found
            //.json(err);
            // replaced error message with custom message because the program kept crashing when trying to access the error message
            .json({ message: 'No trips available' });
    } else {
        // success - return the list of trips
        return res
            .status(200) // 200 OK
            .json(q); 
    }
};

const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode}) // find trip by code
        .exec();

        // uncomment this to show results in the console or comment to hide
        //console.log(q); 

    if (!q || q.length === 0) { // if there are no trips
        // database returned no data
        return res
            .status(404) // 404 Not Found
            //.json(err);
            // replaced error message with custom message because the program kept crashing when trying to access the error message
            .json({ message: 'Trip not found' });
    } else {
        // success - return the list of trips
        return res
            .status(200) // 200 OK
            .json(q); 
    }
};

// POST: /trips - add a new trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save(); // save the new trip to the database
    // negated per standard code practices
    if (q) {
        // success - return the new trip
        return res
            .status(201) // 201 Created
            .json(q);
    } else { // Database returned no date
        return res
            .status(400) 
            //.json(err);
            // replaced error message with custom message because the program kept crashing when trying to access the error message
            .json({ message: 'Trip could not be added' });
    }
    // uncomment this to show results in the console or comment to hide
    //console.log(q);
};

// PUT: /trips/:tripCode - update an existing trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    // uncomment for debugging purposes or comment to hide
    //console.log(req.params);
    //console.log(req.body);
    const q = await Model
        .findOneAndUpdate(
            {'code' : req.params.tripCode}, // find trip by code
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
        )
        .exec();
    // inverted per standard code practices
    if (q) {
        // success - return the updated trip
        return res
            .status(201) // 201 Created
            .json(q);
    } else {
        // Database returned no data
        return res
            .status(400) 
            //.json(err);
            // replaced error message with custom message because the program kept crashing when trying to access the error message
            .json({ message: 'Trip not found or could not be updated' });
    }
};

// DELETE: /trips/:tripCode - delete a trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsDeleteTrip = async (req, res) => {
    const q = await Model
        .findOneAndDelete(
            {'code' : req.params.tripCode} // find trip by code
        )
        .exec();
    if (q) {
        // success - return the deleted trip    
        return res
            .status(200) // 200 OK
            .json(q);
    } else {
        // Database returned no data
        return res
            .status(400) 
            //.json(err);
            // replaced error message with custom message because the program kept crashing when trying to access the error message
            .json({ message: 'Trip not found or could not be deleted' });
    }   
};


module.exports = { tripsList, tripsFindByCode, tripsAddTrip, tripsUpdateTrip, tripsDeleteTrip };

