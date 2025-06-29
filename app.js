const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");
const session=require("express-session");
const MongoDbStore=require("connect-mongodb-session")(session);
 const csrf=require('csurf');
 const flash=require('connect-flash');
//const mongoConnect=require('./util/database').mongoConnect;
const app = express();
const MONGODB_URI="mongodb://localhost:27017/moongosetest?retryWrites=true";
const store=new MongoDbStore({
  uri:MONGODB_URI,
  collection:'sessions'
});
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ 
    secret:'mysecret',
    resave:false,
    saveUninitialized:false,
    store:store
  }));


const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      
      console.log("Error fetching user:", err);
 }
 );
});
app.use((req,res,next)=>{
  res.locals.isAuthenticated=req.session.isLoggedIn;
  res.locals.csrfToken=req.csrfToken();
  next();
});
app.use("/admin", adminRoutes);
//app.use("/", shopRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb://localhost:27017/moongosetest?retryWrites=true")
  .then((result) => {
    /*User.findOne().then((user) => {
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
    });*/

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
//mongoConnect(()=>{

//})
//app.listen(3000);
