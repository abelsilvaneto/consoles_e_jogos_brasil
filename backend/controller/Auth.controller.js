// esse arquivo foi criado para realizar o login do cliente
const Cliente = require('../models/Cliente')
const CryptoJs = require('crypto-js')
const CHAVE_SEGREDO = 'CHAVE_BAIXA'

const login = async (req, res) => {
    const valores = req.body

    if (!valores.email || !valores.senha) {
        return res.status(401).json('Coloque todos os valores')
    }

    try {
        const cliente = await Cliente.findOne({ where: { email: email } })

        if (!cliente) {
            return res.status(401).json({ message: 'Cliente não achado ' })
        }

        const bytes = CryptoJs.AES.decrypt(valores.senha, CHAVE_SEGREDO)
        console.log(bytes)
        const senhaDescripto = bytes.toString(CryptoJS.enc.Utf8)
        console.log(senhaDescripto)

        if (valores.senha !== senhaDescripto) {
            return res.status(401).json({ message: 'senha incorreta' })
        }

        const horaMs = 1.5 * 60 * 60 * 1000
        const tempoExpiracao = Date.now() + horaMs

        const payload = {
            idCliente: cliente.codCliente,
            nome: cliente.nome,
            expiraEm: tempoExpiracao
        }

        const token = CryptoJS.AES.encrypt(JSON.stringify(payload), CHAVE_SECRETA).toString()

        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            token: token,
            nome: cliente.nome
        })
    } catch (err) {
        console.error('Erro ao tentar fazer o login:', err)
        return res.status(500).json({ message: 'Erro ao tentar fazer o login!' })
    }
}

module.exports = { login }