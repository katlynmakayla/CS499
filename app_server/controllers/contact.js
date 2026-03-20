const contact = (req, res) => {
  res.render('contact', {
    title: 'Contact - Travlr Getaways',
    isContact: true
  });
};

module.exports = { contact };