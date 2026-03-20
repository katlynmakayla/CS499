// Bring in the DB connection and the Trip schema
//const mongoose = require('./db');
//const Trip = require('./travlr');     

import mongoose from './db.js';
import Trip from './travlr.js';
import fs from 'node:fs';

// Read seed data from JSON file
// var fs = require('fs');
let trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// delete any existing records, then insert the seed data
// logging added because I like to see what's happening
const seedDB = async () => {
    try {
        await Trip.deleteMany({}); 
        console.log('Existing trips removed');
        await Trip.insertMany(trips);
        console.log('Seed data inserted');
    } catch (err) { // added error logging
        console.error('Error seeding database:', err);
    } 
};

// Close the MongoDB connection and exit the process
// seedDB().then(async () => {
//     await mongoose.connection.close();
//     console.log('Database connection closed');
//     process.exit(0);
// });

// warning: Prefer top-level await over using a promise chain. 
try {
    await seedDB();
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
} catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
}
