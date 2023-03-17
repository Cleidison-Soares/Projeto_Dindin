const { Router } = require("express");

const { listarCategoria } = require("./controladores/categorias");
const { login } = require("./controladores/login");
const {
  cadastrarTransacao,
  listarTransacoes,
  atualizarTansacao,
  detalharTransacao,
  obterExtrato,
  deletarTransacao,
} = require("./controladores/transacoes");

const {
  cadastrarUsuario,
  detalharUsuario,
  atualizarUsuario,
} = require("./controladores/usuarios");

const {
  validarDados,
  verificarSeIdTransacaoENumero,
} = require("./intermediarios/validarDadosTransacao");

const { verificarUsario } = require("./intermediarios/verificarUsuario");

const {
  verificarUsuariLogado,
} = require("./intermediarios/verificarUsuarioLogado");

const rotas = Router();

rotas.post("/usuario", verificarUsario, cadastrarUsuario);
rotas.post("/login", login);

rotas.get("/usuario", verificarUsuariLogado, detalharUsuario);
rotas.get("/categoria", verificarUsuariLogado, listarCategoria);

rotas.post(
  "/transacao",
  verificarUsuariLogado,
  validarDados,
  cadastrarTransacao
);

rotas.get("/transacao", verificarUsuariLogado, listarTransacoes);

rotas.put(
  "/transacao/:id",
  verificarUsuariLogado,
  verificarSeIdTransacaoENumero,
  validarDados,
  atualizarTansacao
);

rotas.put("/usuario", verificarUsuariLogado, atualizarUsuario);
rotas.get("/transacao/extrato", verificarUsuariLogado, obterExtrato);

rotas.get(
  "/transacao/:id",
  verificarUsuariLogado,
  verificarSeIdTransacaoENumero,
  detalharTransacao
);

rotas.delete(
  "/transacao/:id",
  verificarUsuariLogado,
  verificarSeIdTransacaoENumero,
  deletarTransacao
);

module.exports = rotas;
