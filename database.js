const { Client } = require("pg");

const db = new Client("postgres://localhost/pets");

module.exports = db
