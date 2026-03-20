const about = (req, res) => {
  res.render('about', {
    title: 'About - Travlr Getaways',
    isAbout: true
  });
};

module.exports = { about };