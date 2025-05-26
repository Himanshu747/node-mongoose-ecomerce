const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");
//const mongoConnect=require('./util/database').mongoConnect;
const app = express();
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findById("6830b4bffcc29360ba8ec471")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log("Error fetching user:", err));
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/admin", adminRoutes);
app.use("/", shopRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb://localhost:27017/moongosetest?retryWrites=true")
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "him@test.com",
          cart: {
            items: [],
          },
        });
         user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
//mongoConnect(()=>{

//})
//app.listen(3000);
