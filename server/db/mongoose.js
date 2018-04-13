const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongodb://nata-ivanova:3449nat_ml@ds241699.mlab.com:41699/todos-app
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';

mongoose.connect(url);

module.exports = { mongoose };