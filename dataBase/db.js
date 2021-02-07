const musql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: '../.env' });

const db = musql.createConnection({
    database: process.env.DB,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
});

module.exports = db;
