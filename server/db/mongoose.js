const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const url = process.env.MONGODB_URI;

mongoose.connect(url);

module.exports = { mongoose };