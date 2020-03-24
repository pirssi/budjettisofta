var express = require("express");
var app = express();

// npm install body-parser
var bodyParser = require('body-parser');
var BudgetController = require('./budgetController');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

//CORS middleware Cross-Origin Resource Sharing 
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

//console.log("Serveri käynnistetty");

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('html_sivut'));

// REST API Budget

app.route('/kayttajat')
    .get(BudgetController.fetchKayttajat);

app.route('/kayttajanbudjetit/:id')
    .get(BudgetController.fetchKayttajanBudjetit);

app.route('/kayttaja/:nimi')
    .get(BudgetController.fetchKayttaja)

/*app.route('/budjetti')
    .get(BudgetController.fetchAll)
    .post(BudgetController.create);

app.route('/budjetti/:id')
    .put(BudgetController.update)
    .delete(BudgetController.delete)
    .get(BudgetController.fetchOne);
//
app.route('/BudgetType')
    .get(BudgetController.fetchTyyppi)
    .post(BudgetController.create);

app.route('/BudgetType/:Selite')
    .get(BudgetController.fetchTyyppiSelite)
    .post(BudgetController.create);*/



//app.route('/Kayttajat/:nimi')
//    .get(BudgetController.fetchKayttaja);



app.listen(port, hostname, () => {
    console.log(`Server running AT http://${hostname}:${port}/`);
});
