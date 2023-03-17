const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "123456",
  database: "dindin",
});

const buscarBanco = (requisicao, resposta) => {
  return pool.query(requisicao, resposta);
};

module.exports = {
  pool,
  buscarBanco,
};
