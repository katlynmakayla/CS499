/*GET Homepage*/
const login = (req, res) => {
  res.render("login", { title: "Travlr Getaways - Login" });
};
module.exports = {
  login,
};  