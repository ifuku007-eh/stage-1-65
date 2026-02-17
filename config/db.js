const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "portfolio_web",
  password: "thakr4wqe",
  port: 5432,
});

module.exports = pool;
