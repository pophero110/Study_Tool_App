//Import test.env into process.env
require("dotenv").config({ path: "./config/dev.env" });
const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();
const port = process.env.PORT;

//Build connection to database
require("./db/mongoose");

//Routers
const reminderRouter = require("./routes/point");
const userRouter = require("./routes/user");

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlerbars engine and views path
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to server
app.use(express.static(publicDirectoryPath));

//Parse request body from json to object
app.use(express.json());
//Parse form data to body
// app.use(express.urlencoded({ extended: true }));

app.use(reminderRouter);
app.use(userRouter);

//Render specific page
app.get("/", (req, res) => {
  res.render("index", {
    title: "homepage",
  });
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.render("login");
});

//match any route name excepts the routes above
// app.get("*", (req, res) => {
//   res.render("404", {
//     title: "404",
//     message: "page not found.",
//   });
// });

app.listen(port, () => {
  console.log("server started at " + port);
});

module.exports = app;
