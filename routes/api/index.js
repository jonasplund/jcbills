var apiRouter = require('express').Router();

require('./bill.js')(apiRouter);
require('./bills.js')(apiRouter);
require('./pay.js')(apiRouter);

module.exports = apiRouter;