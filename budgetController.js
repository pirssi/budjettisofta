'use strict'

// npm install mysql --save
var mysql = require('mysql');
var bcrypt = require('bcrypt');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Note! Do not use root credentials in production!
  password: 'root',
  database: 'budjetti'
});

module.exports =
{
  //Kirjautumisen (login.ejs) kutsuma funktio
  loginKayttaja: async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    if (username && password) {

      connection.query('SELECT Salasana FROM kayttaja WHERE Nimi = ?', [username], function (error, results, fields) {
        if (results.length > 0) {

          //console.log(results[0].Salasana);

          var hashedPassword = results[0].Salasana;

          bcrypt.compare(password, hashedPassword, function(err, isMatch) {
            if (err) {
              throw err
            } else if (!isMatch) {
              //console.log('eipä ollu')
              res.render('login.ejs', { msg: 'Salasana ei täsmää' });
            } else {
              //console.log('jahuuuu');
              req.session.loggedin = true;
              req.session.username = username;
              res.redirect('/');
            }
          })
        } else {
          res.render('login.ejs', { msg: 'Nimeä ei löydy' });
        }
      })

      /*try {
        var hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
      } catch {
        //res.render('register.ejs', { msg: 'Virhe, yritä uudestaan' });
      }

      connection.query('SELECT * FROM kayttaja WHERE Nimi = ? AND Salasana = ?', [username, hashedPassword], function (error, results, fields) {
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('/');
        } else {
          res.render('login.ejs', { msg: 'Nimi tai salasana on väärä' });
        }
        res.end();
      });*/


    } else {
      res.render('login.ejs', { msg: 'Syötä nimi ja salasana' });
      res.end();
    }
  },


  //Rekisteröinnin (/)register.ehs) kutsuma funktio
  registerKayttaja: async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    //if (username && password) {

    try {
      var hashedPassword = await bcrypt.hash(password, 10)
      //console.log(hashedPassword)
    } catch {
      res.render('register.ejs', { msg: 'Virhe, yritä uudestaan' });
    }
    connection.query('INSERT INTO kayttaja (Nimi, Salasana) VALUES (?, ?)', [username, hashedPassword], function (error, results, fields) {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          res.render('register.ejs', { msg: 'Käyttäjän nimi on jo käytössä' });
        }
        else {
          res.render('register.ejs', { msg: error });
        }
      }
      else {
        //console.log("Data = " + JSON.stringify(results)); //poista tää ku toimii :D 
        res.statusCode = 201;
        res.redirect('/login');
      }
    });
  },

  fetchKayttajat: function (req, res) {
    let sql = 'SELECT Id, Nimi, Salasana FROM Kayttaja';
    /*if (req.query.asty_avain != undefined)
      sql += " AND asty_avain = " + req.query.asty_avain;*/
    if (req.query.nimi != undefined)
      sql += " AND Nimi LIKE '" + req.query.nimi + "'"; //t*
    /*if (req.query.osoite != undefined)
      sql += " AND Osoite LIKE '" + req.query.osoite + "%'";*/

    connection.query(sql, function (error, results, fields) {

      if (error) {
        console.log("Error fetching data from db, reason: " + error);
        //res.send(error);
        res.send({ code: "NOT OK", error_msg: error, data: "" });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.statusCode = 200;
        res.json(results);

      }
    });
  },
  fetchKayttaja: function (req, res) {
    let sql = "SELECT * FROM Kayttaja WHERE Nimi = '" + req.params.nimi + "'";

    connection.query(sql, function (error, results, fields) {

      if (error) {
        console.log("Error fetching data from db, reason: " + error);
        //res.send(error);
        res.send({ code: "NOT OK", error_msg: error, data: "" });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.statusCode = 200;
        res.json(results);

      }
    });
  },
  fetchKayttajanBudjetit: function (req, res) {
    let sql = 'SELECT K.NIMI, B.NIMI FROM kayttaja AS K INNER JOIN kayttajanbudjetit AS KB ON K.ID = KB.Kayttaja_Id INNER JOIN budjetti AS B ON KB.Budjetti_Id = B.Id WHERE K.Id = ' + req.params.id;
    /*if (req.query.asty_avain != undefined)
      sql += " AND asty_avain = " + req.query.asty_avain;
    if (req.query.nimi != undefined)
      sql += " AND Nimi LIKE '" + req.query.nimi + "'"; //t*
    /*if (req.query.osoite != undefined)
      sql += " AND Osoite LIKE '" + req.query.osoite + "%'";*/

    connection.query(sql, function (error, results, fields) {

      if (error) {
        console.log("Error fetching data from db, reason: " + error);
        //res.send(error);
        res.send({ code: "NOT OK", error_msg: error, data: "" });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.statusCode = 200;
        res.json(results);

      }
    });

  }
}
