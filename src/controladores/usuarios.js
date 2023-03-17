const { pool, buscarBanco } = require("../conexao");
const bcrypt = require("bcrypt");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaBcrypt = await bcrypt.hash(senha, 10);

    const resposta = await buscarBanco(
      `insert into usuarios 
        (nome, email, senha)
        values ($1, $2, $3) returning *`,
      [nome, email, senhaBcrypt]
    );

    return res.status(201).json({
      id: resposta.rows[0].id,
      nome: resposta.rows[0].nome,
      email: resposta.rows[0].email,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const detalharUsuario = async (req, res) => {
  try {
    const { id, nome, email } = req.usuario;

    const usuario = {
      id,
      nome,
      email,
    };

    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
};

const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.usuario;

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "os campos nome, e-mail e senha devem ser informados",
      });
    }

    const { rowCount } = await pool.query(
      "select * from usuarios where email = $1",
      [email]
    );

    if (rowCount > 0) {
      return res.status(400).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      });
    }

    const novaSenha = await bcrypt.hash(senha, 10);

    await pool.query(
      "update usuarios set nome = $1, email = $2, senha = $3 where id = $4",
      [nome, email, novaSenha, id]
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  atualizarUsuario,
};
