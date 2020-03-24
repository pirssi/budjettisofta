"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const BudgetController = require("./budgetController");

const app = express();

const hostname = "127.0.0.1";
const port = process.env.PORT || 3001;

const allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
};

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.route("/").get((req, res) => {
  if (req.session.loggedin) {
    res.render("index.ejs", { name: req.session.username });
  } else {
    res.redirect("/login");
  }
  res.end();
});

app
  .route("/login")
  .get((req, res) => {
    if (req.session.loggedin) {
      res.redirect("/");
    } else {
      res.render("login.ejs");
    }
    res.end();
  })
  .post(BudgetController.loginKayttaja);

app
  .route("/register")
  .get((req, res) => {
    res.render("register.ejs");
  })
  .post(BudgetController.registerKayttaja);

app.route("/logout").get((req, res) => {
  if (req.session.loggedin) {
    req.session.loggedin = false;
    res.redirect("/");
  } else {
    res.redirect("/");
  }
  res.end();
});

app.route("/menot").get((req, res) => {
  if (req.session.loggedin) {
    res.render("menot.ejs");
  } else {
    res.redirect("/login");
  }
  res.end();
});

app.route("/budjetit").get((req, res) => {
  if (req.session.loggedin) {
    res.render("budjetit.ejs", {
      name: req.session.username,
      userId: req.session.userId
    });
  } else {
    res.redirect("/login");
  }
  res.end();
});

app.route("/kayttajat").get(BudgetController.fetchKayttajat);

app
  .route("/kayttajanbudjetit/:id")
  .get(BudgetController.fetchKayttajanBudjetit);

app.route("/kayttaja/:nimi").get(BudgetController.fetchKayttaja);

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
