require('dotenv').config();
const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;
const db = mongoose.connect(URI, {
    useUnifiedTopology:true,
    useNewUrlParser: true
})
module.exports = db;
//const store = new MongoStore({ url: URI });

//const myDB = require('./connection');
//const MongoStore = require('connect-mongo')(session);
// myDB(async client => {
//     const myDataBase = await client.db('issue-tracker').collection('issues');
// )}

