var mongoose = require('mongoose');
var User = mongoose.model('User');

var hash = require('../helpers/hash');

module.exports = function (app) {
    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.post('/login', function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var redirect = req.body.redirect ? req.body.redirect : '/';

        if (!(username && password)) {
            return invalid();
        }

        username = username.toLowerCase();

        User.findById(username, function (err, user) {
            if (err) return next(err);
            if (!user) {
                return invalid();
            }

            if (user.hash != hash(password, user.salt)) {
                return invalid();
            }

            req.session.authenticated = true;
            req.session.username = username;
            console.log(redirect);
            res.redirect(redirect);
        });

        function invalid() {
            return res.render('login.jade', { invalid: true });
        }
    });

    app.get('/logout', function (req, res) {
        req.session.authenticated = false;
        req.session.admin = false;
        res.redirect('/');
    });
};