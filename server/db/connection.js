//connection to db
const monk = require('monk');

const db = monk('localhost/auth-for-noobs');

module.exports = db;
