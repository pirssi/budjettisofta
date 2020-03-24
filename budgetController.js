'use strict'

// npm install mysql --save
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Note! Do not use root credentials in production!
  password: 'root',
  database: 'budjetti'
});

module.exports =
{

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
