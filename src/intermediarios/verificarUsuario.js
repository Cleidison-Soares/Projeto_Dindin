const { buscarBanco } = require('../conexao')

const verificarUsario = async (req, res, next) => {
    const { nome, email, senha } = req.body

    if (!nome) {
        return res.status(404).json('nome obrigatório')
    }

    if (!email) {
        return res.status(404).json('email obrigatório')
    }

    if (!senha) {
        return res.status(404).json('senha obrigatória')
    }

    try {

        const respostaBanco = await buscarBanco('select * from usuarios where email = $1', [email])

        if (respostaBanco.rowCount === 0) {
            return next()
        }

        if (email === respostaBanco.rows[0].email) {
            return res.status(404).json({
                "mensagem": "Já existe usuário cadastrado com o e-mail informado."
            })
        }

        next()

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ mensagem: 'erro interno de servidor' })
    }

}


module.exports = {
    verificarUsario
}