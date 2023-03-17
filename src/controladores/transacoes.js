const { pool, buscarBanco } = require("../conexao");

const cadastrarTransacao = async (req, res) => {
  const { tipo, descricao, valor, data, categoria_id } = req.body;
  const id = req.usuario.id;

  try {
    const inserir = await buscarBanco(
      `insert into transacoes 
        (tipo, descricao, valor, data, categoria_id, usuario_id)
        values 
        ($1,$2,$3,$4,$5,$6) returning * `,
      [tipo, descricao, valor, data, categoria_id, id]
    );

    const desc = await buscarBanco(
      `select descricao from categorias where id = $1`,
      [categoria_id]
    );

    const objeto = {
      id: inserir.rows[0].id,
      tipo: tipo,
      descricao: descricao,
      valor: valor,
      data: data,
      usuario_id: id,
      categoria_id: categoria_id,
      categoria_nome: desc.rows[0].descricao,
    };

    return res.status(201).json(objeto);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listarTransacoes = async (req, res) => {
  try {
    const { id } = req.usuario;
    const { filtro } = req.query;

    const transacoesUsuario = await pool.query(
      "select t.*, c.descricao as categoria_nome from transacoes t left join categorias c on t.categoria_id = c.id where t.usuario_id = $1",
      [id]
    );

    let resultadoTrasacoes = transacoesUsuario.rows;

    if (filtro) {
      resultadoTrasacoes = resultadoTrasacoes.filter((transacao) => {
        return filtro.includes(transacao.categoria_nome);
      });
    }

    return res.json(resultadoTrasacoes);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const atualizarTansacao = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const idTransacao = req.params.id;

    const { descricao, valor, data, categoria_id, tipo } = req.body;

    const { rowCount } = await pool.query(
      "select * from transacoes where id = $1 and usuario_id = $2 and categoria_id = $3",
      [idTransacao, idUsuario, categoria_id]
    );

    if (rowCount < 1) {
      return res.status(404).json({ mensagem: "transacao não encontrada" });
    }

    await pool.query(
      "update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6",
      [descricao, valor, data, categoria_id, tipo, idTransacao]
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const detalharTransacao = async (req, res) => {
  const id_usuario = req.params.id;
  const id_token = req.usuario.id;

  try {
    const resposta_detalhada = await buscarBanco(
      `select * from transacoes
        where usuario_id = $1 and id = $2`,
      [id_token, id_usuario]
    );

    if (resposta_detalhada.rowCount === 0) {
      return res.status(404).json({
        mensagem: "Transação não encontrada.",
      });
    }

    const id_categoria = resposta_detalhada.rows[0].categoria_id;

    const resposta_categoria = await buscarBanco(
      `select descricao from categorias
        where id = $1`,
      [id_categoria]
    );

    const objeto = {
      id: resposta_detalhada.rows[0].id,
      tipo: resposta_detalhada.rows[0].tipo,
      descricao: resposta_detalhada.rows[0].descricao,
      valor: resposta_detalhada.rows[0].valor,
      data: resposta_detalhada.rows[0].data,
      usuario_id: resposta_detalhada.rows[0].usuario_id,
      categoria_id: resposta_detalhada.rows[0].categoria_id,
      categoria_nome: resposta_categoria.rows[0].descricao,
    };

    return res.status(200).json(objeto);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const obterExtrato = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const entradas = await pool.query(
      "select sum(valor) from transacoes where usuario_id = $1 and tipo = $2",
      [idUsuario, "entrada"]
    );

    const saidas = await pool.query(
      "select sum(valor) from transacoes where usuario_id = $1 and tipo = $2",
      [idUsuario, "saida"]
    );

    const extrato = {
      entrada: entradas.rows[0].sum,
      saida: saidas.rows[0].sum,
    };

    return res.json(extrato);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deletarTransacao = async (req, res) => {
  const id_transacao = req.params.id;
  const id_token = req.usuario.id;

  try {
    const resposta = await buscarBanco(
      `delete from transacoes
        where usuario_id = $1 and id = $2`,
      [id_token, id_transacao]
    );

    if (resposta.rowCount === 0) {
      return res.status(400).json({
        mensagem: "Transação não encontrada.",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ menssagem: error.message });
  }
};

module.exports = {
  cadastrarTransacao,
  listarTransacoes,
  atualizarTansacao,
  detalharTransacao,
  obterExtrato,
  deletarTransacao,
};
