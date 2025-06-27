const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("Cloud DB connected!");
});

const port = process.env.PORT || 3030;
// listen to the server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
