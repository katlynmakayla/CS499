/*GET Homepage*/
const register = (req, res) => {
  res.render("register", { title: "Travlr Getaways - Register" });
};
module.exports = {
  register,
};  