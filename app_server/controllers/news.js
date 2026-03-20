const news = (req, res) => {
  res.render('news', {
    title: 'News - Travlr Getaways',
    isNews: true
  });
};

module.exports = { news };