"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const BudgetController = require("./budgetController");

const allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
}

const hostname = "127.0.0.1";
const port = 3001;

const app = express();
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

app.route('/kayttajanbudjetit/:id')
    .get(BudgetController.fetchKayttajanBudjetit);

app.route('/kayttaja/:nimi')
    .get(BudgetController.fetchKayttaja)

app.listen(port, hostname, () => {
    console.log(`Server running AT http://${hostname}:${port}/`);
});
