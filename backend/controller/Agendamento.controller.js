// criado para gerenciar os dados do agendamento e operacoes
const Agendamento = require('../models/Agendamento')
const Cliente = require('../models/Cliente')
const Console = require('../models/Console')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.data || !valores.hora || !valores.idCliente || !valores.idConsole) {
        return res.status(400).json({ message: 'Todos os campos (data, hora, idCliente, idConsole) são obrigatórios!' })
    }

    try {
        const cliente = await Cliente.findByPk(valores.idCliente)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente informado não existe!' })
        }

        const console = await Console.findByPk(valores.idConsole)
        if (!console) {
            return res.status(404).json({ message: 'Console informada não existe!' })
        }

        const novoAgendamento = await Agendamento.create(valores)
        return res.status(201).json({ message: 'Agendamento registrado com sucesso!', agendamento: novoAgendamento })
    } catch (err) {
        console.error('Erro ao criar agendamento:', err)
        return res.status(500).json({ message: 'Erro ao registrar agendamento!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const agendamento = await Agendamento.findByPk(id)
        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado!' })
        }

        if (valores.idCliente) {
            const cliente = await Cliente.findByPk(valores.idCliente)
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente informado não existe!' })
            }
        }

        if (valores.idConsole) {
            const console = await Console.findByPk(valores.idConsole)
            if (!console) {
                return res.status(404).json({ message: 'Console informada não existe!' })
            }
        }

        await Agendamento.update(valores, { where: { codAgendamento: id } })
        return res.status(200).json({ message: 'Agendamento atualizado com sucesso!' })
    } catch (err) {
        console.error('Erro ao atualizar agendamento:', err)
        return res.status(500).json({ message: 'Erro ao atualizar agendamento!' })
    }
}

const listarAgenda = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            order: [['data', 'ASC']],
            include: [
                {
                    model: Cliente,
                    as: 'ClienteAgendamento',
                    attributes: ['codCliente', 'nome', 'email', 'telefone']
                },
                {
                    model: Console,
                    as: 'ConsoleAgendamento',
                    attributes: ['codConsole', 'modelo', 'marca', 'tipoServico']
                }
            ]
        })

        return res.status(200).json(agendamentos)
    } catch (err) {
        console.error('Erro ao listar agenda:', err)
        return res.status(500).json({ message: 'Erro ao listar agenda!' })
    }
}

module.exports = { cadastrar, atualizar, listarAgenda }