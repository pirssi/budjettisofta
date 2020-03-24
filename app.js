"use strict";

const mysql = require("mysql");
const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "budjetti"
});

module.exports = {
  loginKayttaja: async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      connection.query(
        "SELECT Id, Salasana FROM kayttaja WHERE Nimi = ?",
        [username],
        function (error, results, fields) {
          if (results.length > 0) {
            const hashedPassword = results[0].Salasana;
            const Id = results[0].Id;

            bcrypt.compare(password, hashedPassword, function (err, isMatch) {
              if (err) {
                throw err;
              } else if (!isMatch) {
                res.render("login.ejs", { msg: "Salasana ei täsmää" });
              } else {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.userId = Id;
                res.redirect("/");
              }
            });
          } else {
            res.render("login.ejs", { msg: "Nimeä ei löydy" });
          }
        }
      );
    } else {
      res.render("login.ejs", { msg: "Syötä nimi ja salasana" });
      res.end();
    }
  },

  registerKayttaja: async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    let errorMsg = "";

    function checkLengthWhitespace(o, inputType, min, max) {
      if (/\s/.test(o)) {
        errorMsg = "Syötteessä (" + inputType + ") ei saa olla välilyöntejä";
        return false;
      } else if (o.length < min) {
        errorMsg =
          "Syötteen (" +
          inputType +
          ") pitää olla vähintään " +
          min +
          " merkkiä";
        return false;
      } else if (o.length > max) {
        errorMsg =
          "Syötteessä (" +
          inputType +
          ") saa olla korkeintaan " +
          max +
          " merkkiä";
        return false;
      } else {
        return true;
      }
    }
    function checkSymbols(o, inputType) {
      const symbols = /(?:[!-\/:-@\[-`\{-~\xA1-\xA9\xAB\xAC\xAE-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u037E\u0384\u0385\u0387\u03F6\u0482\u055A-\u055F\u0589\u058A\u058D-\u058F\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0606-\u060F\u061B\u061E\u061F\u066A-\u066D\u06D4\u06DE\u06E9\u06FD\u06FE\u0700-\u070D\u07F6-\u07F9\u07FE\u07FF\u0830-\u083E\u085E\u0964\u0965\u0970\u09F2\u09F3\u09FA\u09FB\u09FD\u0A76\u0AF0\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0C84\u0D4F\u0D79\u0DF4\u0E3F\u0E4F\u0E5A\u0E5B\u0F01-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F85\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u104A-\u104F\u109E\u109F\u10FB\u1360-\u1368\u1390-\u1399\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DB\u1800-\u180A\u1940\u1944\u1945\u19DE-\u19FF\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B6A\u1B74-\u1B7C\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2010-\u2027\u2030-\u205E\u207A-\u207E\u208A-\u208E\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2775\u2794-\u2B73\u2B76-\u2B95\u2B98-\u2BC8\u2BCA-\u2BFE\u2CE5-\u2CEA\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303F\u309B\u309C\u30A0\u30FB\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u32FE\u3300-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAA77-\uAA79\uAADE\uAADF\uAAF0\uAAF1\uAB5B\uABEB\uFB29\uFBB2-\uFBC1\uFD3E\uFD3F\uFDFC\uFDFD\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD00-\uDD02\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9B\uDDA0\uDDD0-\uDDFC\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDC77\uDC78\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEC8\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3F]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3F\uDF44\uDF45]|\uD81B[\uDE97-\uDE9A]|\uD82F[\uDC9C\uDC9F]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE8B]|\uD83A[\uDD5E\uDD5F]|\uD83B[\uDCAC\uDCB0\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD10-\uDD6B\uDD70-\uDDAC\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED4\uDEE0-\uDEEC\uDEF0-\uDEF9\uDF00-\uDF73\uDF80-\uDFD8]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD00-\uDD0B\uDD10-\uDD3E\uDD40-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF\uDE60-\uDE6D])/;
      if (symbols.test(o)) {
        errorMsg = "Syötteessä (" + inputType + ") ei saa olla erikoismerkkejä";
        return false;
      } else {
        return true;
      }
    }

    let valid = true;
    valid = valid && checkLengthWhitespace(username, "käyttäjänimi", 3, 20);
    valid = valid && checkSymbols(username, "käyttäjänimi");
    valid = valid && checkLengthWhitespace(password, "salasana", 4, 25);

    if (!valid) {
      res.render("register.ejs", { msg: errorMsg });
    } else if (valid) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
      } catch {
        res.render("register.ejs", { msg: "Virhe, yritä uudestaan" });
      }
      connection.query(
        "INSERT INTO kayttaja (Nimi, Salasana) VALUES (?, ?)",
        [username, hashedPassword],
        function (error, results, fields) {
          if (error) {
            if (error.code === "ER_DUP_ENTRY") {
              res.render("register.ejs", {
                msg: "Käyttäjän nimi on jo käytössä"
              });
            } else {
              res.render("register.ejs", { msg: error });
            }
          } else {
            res.statusCode = 201;
            res.redirect("/login");
          }
        }
      );
    } else {
      res.render("register.ejs", { msg: "Syötä nimi ja salanasa" });
    }
  },

  fetchKayttajanBudjetit: function (req, res) {
    let sql =
      "SELECT K.NIMI, B.NIMI FROM kayttaja AS K INNER JOIN kayttajanbudjetit AS KB ON K.ID = KB.Kayttaja_Id INNER JOIN budjetti AS B ON KB.Budjetti_Id = B.Id WHERE K.Id = " +
      req.params.id;

    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Error fetching data from db, reason: " + error);
        res.send({ code: "NOT OK", error_msg: error, data: "" });
      } else {
        console.log("Data = " + JSON.stringify(results));
        res.statusCode = 200;
        res.json(results);
      }
    });
  },

  fetchKayttajat: function (req, res) {
    let sql = "SELECT Id, Nimi, Salasana FROM Kayttaja";
    if (req.query.nimi != undefined)
      sql += " AND Nimi LIKE '" + req.query.nimi + "'";

    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Error fetching data from db, reason: " + error);
        res.send({ code: "NOT OK", error_msg: error, data: "" });
      } else {
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
        res.send({ code: "NOT OK", error_msg: error, data: "" });
      } else {
        console.log("Data = " + JSON.stringify(results));
        res.statusCode = 200;
        res.json(results);
      }
    });
  }
};
