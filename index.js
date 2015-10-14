var express     = require('express');
var mongoose    = require('mongoose');
var winston     = require('winston');

var models      = require('./models');
var config      = require('./config.js');
var middleware  = require('./middleware');
var routes      = require('./routes');

mongoose.connect(config.db.host + '/' + config.db.name);
var db = mongoose.connection;
db.on('error', function () {
    winston.log('error', 'Failed to connect to MongoDB');
});
db.once('open', function (err) {
    if (err) throw err;

    var app = express();
    middleware(app);
    routes(app);

    app.set('views', './views');
    app.set('view engine', 'jade');

    app.listen(config.web.port, function () {
        winston.log('info', 'jcbills is listening to port', config.web.port);
    });
});