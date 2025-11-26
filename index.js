const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());
const moviesRoute = require("./routes/moviesRoute");
app.use("/movie", moviesRoute);

const initApp = () => {
  const pr = new Promise((resolve) => {
    mongoose
      .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
      .then(() => {
        resolve(app);
      });
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
  });
  return pr;
};

module.exports = initApp;
