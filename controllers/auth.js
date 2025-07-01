const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const {validationResult}=require('express-validator');
// const transporter=nodemailer.createTransport(sendgridTransport({
//   auth::{
//     api_user:,
//     api_key;
//   }
// }));
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    errorMessage: message,
     oldInput:{
        email:'',
        password:'',
        confirmPassword:''
      },
       validationErrors:[]
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      docTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email:email,
        password:password,
        confirmPassword:req.body.confirmPassword
      },
      validationErrors:errors.array()
    });
  }

       bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        })
    .catch((err) => {
      console.log(err);
    });
  //   res.redirect('/');
};
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  // const isLoggedIn=req.get('Cookie').split(";")[0].trim().split('=')[1];
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    errorMessage: message,
  });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
exports.postLogin = (req, res, next) => {
  req.isLoggedIn = true;
  const email = req.body.email;
  const password = req.body.password;
  const errors=validationResult(req);
  if(!errors.isEmpty()){
     return res.status(422).render("auth/login", {
    path: "/login",
    docTitle: "Login",
    errorMessage: errors.array()[0].msg
   
  });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          return res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
      // req.user = user;
      //   req.session.isLoggedIn = true;
      //   req.session.user = user;
      //   req.session.save((err) => {
      //     console.log(err);
      //     res.redirect("/");
      //   });
      //   res.redirect("/");
    })
    .catch((err) => console.log("Error fetching user:", err));
};
exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    docTitle: "Reset Password",
    errorMessage: message,
  });
};
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that account found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save();
      })
      .then((result) => {
        res.redirect("/");
        /*
      email code

      transporter.sendMail({
          to:req.body.email,
          from:'shop@node.com',
          subject:'Password reset',
          html:`
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password</p>
          `
      })
      */
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        docTitle: "New Password",
        errorMessage: message,
        userId:user._id.toString(),
        passwordToken:token
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword=req.body.password;
  const userId=req.body.userId;

  const passwordToken=req.body.passwordToken;
  let resetUser;


  User.findOne({
    resetToken:passwordToken,
    resetTokenExpiration: { $gt: Date.now() }
    ,_id:userId 
  })
  .then(user=>{
     if (!user) {
      console.log('No user found with ID:', userId);
      return next(new Error('User not found'));
    }
    resetUser = user; // ✅ Assign the found user here
    return bcrypt.hash(newPassword,12);
  })
  .then(hashedPassword=>{
    resetUser.password=hashedPassword;
    resetUser.resetToken=undefined;
    resetUser.resetTokenExpiration=undefined;
    return resetUser.save();
  })
  .then(result=>{
      res.redirect('/login');
  })
  .catch(err=>{
    console.log(err);
  });
};