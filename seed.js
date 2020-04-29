const db = require("./database");

const seed = async () => {
  await db.query("DROP TABLE IF EXISTS cats");
  await db.query("CREATE TABLE cats (name TEXT)");
  await db.query("INSERT INTO cats (name) VALUES ($1)", ["Rigatoni"]);
};

module.exports = seed;
