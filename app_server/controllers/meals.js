let fs = require("node:fs");
let mealsData = JSON.parse(fs.readFileSync("./data/meals.json", "utf8"));

const meals = (req, res) => {
  res.render('meals', { title: 'Meals - Travlr Getaways', meals: mealsData });
};

module.exports = {
  meals,
};
