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
 const serie = req.params.serie

    try {
        const consoles = await Console.findAll()

        const encontrado = consoles.find(c => {
            const bytes = CryptoJS.AES.decrypt(c.numSerie, CHAVE_SECRETA)
            return bytes.toString(CryptoJS.enc.Utf8) === serie
        })

        if (!encontrado) {
            return res.status(404).json({ message: 'Console não encontrado!' })
        }

        return res.status(200).json({
            codConsole: encontrado.codConsole,
            modelo: encontrado.modelo,
            marca: encontrado.marca,
            numSerie: serie,
            tipo: encontrado.tipo,
            idCliente: encontrado.idCliente
        })
    } catch (err) {
        console.error('Erro ao consultar :', err)
        return res.status(500).json({ message: 'Erro ao consultar!' })
    }
}


module.exports = { cadastrar, consultarTermo }
