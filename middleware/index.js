var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var winston = require('winston');
var config = require('../config.js');

var middleware = function (app) {
    app.use('/', express.static(path.join(__dirname, '..', 'public')));

    app.use(cookieParser());

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(session({ 
        store: new MongoStore({ db: config.db.name }),
        secret: config.app.sessionSecret,
        resave: false,
        saveUninitialized: true
    }));

    app.use(function saveSession (req, res, next) {
        res.locals.session = req.session;
        next();
    });

    app.use(function (req, res, next) {
        console.log(req.method, req.url);
        next();
    });
};

module.exports = middleware;