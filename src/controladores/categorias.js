const { buscarBanco} = require('../conexao')

const listarCategoria = async (req, res) => {

    try {
  
      const consultabanco = await buscarBanco('select * from categorias')
  
      return res.status(200).json(consultabanco.rows)
  
  
    } catch (error) {
      console.log(error.message)
      return res.status(500).json('erro interno de servidor')
    }
  
  };

  module.exports = {
    listarCategoria
  }