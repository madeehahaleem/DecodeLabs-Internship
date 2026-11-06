const { DatabaseSync } = require("node:sqlite");

// "users.db" naam ki file banti hai (agar pehle se nahi hai)
const db = new DatabaseSync("users.db");

// Table banao (sirf pehli baar banti hai)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK (length(name) > 0),
    email TEXT NOT NULL UNIQUE
  )
`);

module.exports = db;