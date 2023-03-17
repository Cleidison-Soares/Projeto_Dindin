const validarDados = (req, res, next) => {
  const { tipo, descricao, valor, data, categoria_id } = req.body;

  if (!tipo || !descricao || !valor || !data || !categoria_id) {
    return res.status(400).json({
      mensagem: "Todos os campos obrigatórios devem ser informados.",
    });
  }

  if (tipo != "entrada" && tipo != "saida") {
    return res.status(400).json({
      mensagem: `erro no "tipo" de transação`,
    });
  }

  next();
};

const verificarSeIdTransacaoENumero = (req, res, next) => {
  const idTransacao = req.params.id;
  if (isNaN(idTransacao)) {
    return res
      .status(400)
      .json({ mensagem: "o id da transacao não é um número válido" });
  }

  next();
};

module.exports = {
  validarDados,
  verificarSeIdTransacaoENumero,
};
