var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path')
var bcrypt = require('bcrypt');
var BudgetController = require('./budgetController');

//noi kaikki yllä olevat pitää jokanen asentaa kirjattamalla consoleen 'npm i {paketin nimi eli express, session, bcrypt jne}'

var app = express();

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
//app.use(express.static('html_sivut'));


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// REST API Budget


// etusivu
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        //res.send('Welcome back, ' + req.session.username + '!');
        res.render('index.ejs', { name: req.session.username }) //väliaikasesti tohon enne ku johonki järkevämpään
    } else {
        res.redirect('/login');
    }
    res.end();
});

//kirjautumissivu
app.route('/login')
    .get((req, res) => {
        if (req.session.loggedin) {
            //res.send('Welcome back, ' + req.session.username + '!');
            res.redirect('/');
        } else {
            res.render('login.ejs');
        }
        res.end();

    })
    .post(BudgetController.loginKayttaja);


//rekisteröitymissivu
app.route('/register')
    .get((req, res) => {
        res.render('register.ejs')
    })
    .post(BudgetController.registerKayttaja);

app.route('/logout')
    .get((req, res) => {
        if (req.session.loggedin) {
            //res.send('Welcome back, ' + req.session.username + '!');
            req.session.loggedin = false;
            res.redirect('/');
        } else {
            res.redirect('/');
            //res.render('login.ejs');
        }
        res.end();

    })

//menojenkirjaamissivu
app.get('/menot', (req, res) => {
    if (req.session.loggedin) {
        //res.send('Welcome back, ' + req.session.username + '!');
        res.render('menot.ejs')
    } else {
        res.redirect('/login');
    }
    res.end();
})


/*
BACKUP:D:D:D


app.get('/login', (req, res) => {
    res.render('login.ejs')
});

app.route('/auth')
    .post(BudgetController.loginKayttaja);

    
app.get('/register', (req, res) => {
    res.render('register.ejs')
});
    
*/


//routeja ala WOK

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


/*
TODO:

uloskirjaus
käyttäjänimet välilyönnittömiks?
*/