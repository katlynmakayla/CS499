/* GET recommendations view */
const recommendations = (req, res) => {
    // We just render the page; the script inside the .hbs file 
    // will handle the API call once the page loads.
    res.render('recommendations', { title: 'Recommendations - Travlr Getaways' });
};

module.exports = {
    recommendations
};
