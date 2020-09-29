const mongoose = require('mongoose');

const mongoDB = 'mongodb+srv://adhimas:codingnodrama@widya.nqtce.mongodb.net/widya?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });

const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;