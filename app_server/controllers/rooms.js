let fs = require("node:fs");
let roomOptions = JSON.parse(
  fs.readFileSync("./data/rooms.json", "utf8")
);

/*GET rooms view*/
const rooms = (req, res) => {
  res.render('rooms', { title: 'Rooms - Travlr Getaways', rooms: roomOptions });
};
module.exports = {
  rooms,
};  