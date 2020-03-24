'use strict'

const bcrypt = require("bcrypt");
const mysql = require("mysql");

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "budjetti"
});

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 4;
const PASSWORD_MAX_LENGTH = 36;

function hasSpecialCharacters(input) {
  return !/^[a-zA-Z0-9\_]+$/.test(input);
}

function hasWhiteSpace(input) {
  return /\s/.test(input);
}

function isBetweenMinAndMaxLength(input, min, max) {
  return input.length >= min && input.length <= max;
}

module.exports = {
  login: async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      dbConnection.query(
        "SELECT Id, Salasana FROM kayttaja WHERE Nimi = ?",
        [username],
        function (error, results) {
          if (error) {
            res.render("login.ejs", { msg: error.message });
          }

          if (results.length > 0) {
            const data = results[0];

            bcrypt.compare(password, data.Salasana, function (error, result) {
              if (error) {
                res.render("login.ejs", { msg: error.message });
              } else if (result) {
                req.session.loggedIn = true;
                req.session.username = username;
                req.session.userId = Id;
                res.redirect("/");
              }
            });
          } else {
            res.render("login.ejs", { msg: "Nimi tai salasana väärin!" });
          }
        }
      })
    } else {
      res.render("login.ejs", { msg: "Syötä nimi ja salasana!" });
      res.end();
    }
  },

  register: async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      if (!hasWhiteSpace(username) && !hasWhiteSpace(password)) {
        res.render("register.ejs", {
          msg: "Käyttäjänimi tai salasana eivät saa sisältää välilyöntejä!"
        });
      } else if (
        !isBetweenMinAndMaxLength(
          username,
          USERNAME_MIN_LENGTH,
          USERNAME_MAX_LENGTH
        )
      ) {
        res.render("register.ejs", {
          msg: `Käyttäjänimen täytyy olla pituudeltaan ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} merkkiä!`
        });
      } else if (
        !isBetweenMinAndMaxLength(
          password,
          PASSWORD_MIN_LENGTH,
          PASSWORD_MAX_LENGTH
        )
      ) {
        res.render("register.ejs", {
          msg: `Käyttäjänimen täytyy olla pituudeltaan ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} merkkiä!`
        });
      } else if (hasSpecialCharacters(username)) {
        res.render("register.ejs", {
          msg: `Käyttäjänimi saa sisältää vain isoja ja pieniä kirjaimia, numeroita sekä alaviivoja (_)!`
        });
      } else {
        const passwordHash = await bcrypt.hash(password, 10);

        dbConnection.query(
          "INSERT INTO kayttaja (Nimi, Salasana) VALUES (?, ?)",
          [username, passwordHash],
          function (error) {
            if (error) {
              if (error.code === "ER_DUP_ENTRY") {
                res.render("register.ejs", {
                  msg: "Nimi on jo käytössä!"
                });
              } else {
                res.render("register.ejs", { msg: error.message });
              }
            } else {
              res.statusCode = 201;
              res.redirect("/login");
            }
          }
        );
      }
    } else {
      res.render("register.ejs", { msg: "Syötä nimi ja salasana!" });
    }


  },

  fetchBudgets: function (req, res) {
    dbConnection.query(
      "SELECT K.NIMI, B.NIMI FROM kayttaja AS K INNER JOIN kayttajanbudjetit AS KB ON K.ID = KB.Kayttaja_Id INNER JOIN budjetti AS B ON KB.Budjetti_Id = B.Id WHERE K.Id = ?",
      [req.params.id],
      function (error, results) {
        if (error) {
          console.log("Error fetching data from db, reason: " + error);
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        } else {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.json(results);
        }
      }
    );
  }
};
