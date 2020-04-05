"use strict";

const bodyParser = require("body-parser");
const controller = require("./controller");
const express = require("express");
const session = require("express-session");

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
};

const app = express();
const hostname = "127.0.0.1";
const port = 3001;

app.engine('html', require('ejs').renderFile);
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "89fd57581173dbe97a1e2b9221646b13082d174c78992182c086500f02d49e7b"
  })
);

app.route("/").get((req, res) => {
  if (req.session.loggedIn) {
    res.render("index.html", { name: req.session.username });
  } else {
    res.redirect("/login");
  }
  res.end();
});

app
  .route("/login")
  .get((req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      res.render("login.html");
    }
    res.end();
  })
  .post(controller.login);

app
  .route("/register")
  .get((_req, res) => {
    res.render("register.html");
  })
  .post(controller.register);

app.route("/logout").get((req, res) => {
  req.session.destroy();
  res.redirect("/");
  res.end();
});

app.route("/menot").get((req, res) => {
  if (req.session.loggedIn) {
    res.render("menot.html",{
      name: req.session.username,
      userId: req.session.userId,
      budjettiId: req.session.budjettiId});   
  } else {
    res.redirect("/login");
  }
  res.end();
});

app.route("/budjetit").get((req, res) => {
  if (req.session.loggedIn) {
    res.render("budjetit.html", {
      name: req.session.username,
      userId: req.session.userId
    });
  } else {
    res.redirect("/login");
  }
  res.end();
});

app.route("/kayttajanbudjetit/:id").get(controller.fetchBudgets);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
