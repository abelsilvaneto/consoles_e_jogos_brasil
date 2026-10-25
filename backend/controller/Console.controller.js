// criado para gerenciar os dados do console e operacoes
const Cliente = require('../models/Cliente')
const Console = require('../models/Console')
const CryptoJS = require('crypto-js')

const CHAVE_SEGREDO = 'CHAVE_BAIXA'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.modelo || !valores.marca || !valores.numeroSerie || !valores.tipoServico || !valores.idCliente) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    try {

        const cliente = await Cliente.findByPk(valores.idCliente)
        if (!cliente) {
            return res.status(401).json({ message: 'Cliente nao achado' })
        }


        const numeroSerieCriptografada = CryptoJS.AES.encrypt(valores.numeroSerie, CHAVE_SEGREDO).toString()

        await Console.create({
            modelo: valores.modelo,
            marca: valores.marca,
            numeroSerie: numeroSerieCriptografada,
            tipoServico: tipoServico,
            idCliente: valores.idCliente
        })

        return res.status(201).json({message: 'Console cadastrado com sucesso!'})
    } catch (err) {
        console.error('Erro ao cadastrar Console:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar Console!' })
    }
}

const consultarTermo = async (req, res) => {
    const numeroSerie = req.params.numeroSerie

    try {
        const numeroSerieCriptografada = CryptoJS.AES.encrypt(numeroSerie, CHAVE_SEGREDO).toString()

        const console = await Console.findOne({ where: { numeroSerie: numeroSerieCriptografada } })

        if (!console) {
            return res.status(404).json({ message: 'Console não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(console.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codConsole: console.codConsole,
            modelo: console.modelo,
            marca: console.marca,
            numeroSerie: numeroSerie,
            tipoServico: console.tipoServico,
            idCliente: console.idCliente
        })
    } catch (err) {
        console.error('Erro ao consultar :', err)
        return res.status(500).json({ message: 'Erro ao consultar!' })
    }
}


module.exports = { cadastrar, consultarTermo }
