var express     = require('express');
var login       = require('./login.js');
var apiRouter   = require('./api')

var routes = function (app) {
    // app.use(autoLogin);

    app.use(function assureAuth (req, res, next) {
        if (req.url.indexOf('login') >= 0) {
            return next();
        }
        if (req.session.authenticated !== true) {
            return res.redirect('/login');
        } else {
            next();
        }
    });

    app.use('/api', apiRouter);

    app.get('/', function (req, res) {
        return res.render('index');
    });
    login(app);
};

module.exports = routes;