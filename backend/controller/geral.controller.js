const Cliente = require('../models/Cliente')
const Console = require('../models/Console')
const Agendamento = require('../models/Agendamento')

// ===== CLIENTE =====
const cadastrarCliente = async (req, res) => {
    const valores = req.body
    try {
        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: valores.senha, 
            cpf: valores.cpf,     
            endereco: valores.endereco
        })
        return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar cliente!' })
    }
}

// ===== CONSOLE =====
const cadastrarConsole = async (req, res) => {
    const valores = req.body
    try {
        const novoConsole = await Console.create(valores)
        return res.status(201).json({ message: 'Console cadastrado!', console: novoConsole })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar console!' })
    }
}

const consultarConsole = async (req, res) => {
   
    return res.status(500).json({ message: 'Função de consulta não implementada!' })
}

// ===== AGENDAMENTO =====
const cadastrarAgendamento = async (req, res) => {
    const valores = req.body
    try {
        const novoAgendamento = await Agendamento.create(valores)
        return res.status(201).json({ message: 'Agendamento cadastrado!', agendamento: novoAgendamento })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar agendamento!' })
    }
}

module.exports = {
    authMiddleware,
    cadastrarCliente,
    listarClientes,
    cadastrarConsole,
    consultarConsole,
    cadastrarAgendamento
}