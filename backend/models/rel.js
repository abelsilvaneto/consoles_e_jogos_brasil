// Criei esse arquivo para realizar
const Cliente = require('../models/Cliente')
const Console = require('../models/Console')
const Agendamento = require('../models/Agendamento')

Cliente.hasMany(Agendamento,{
    as: 'AgendamentoCliente',
    foreignKey: 'idCliente',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Cliente,{
    as: 'ClienteAgendamento',
    foreignKey: 'idCliente',
    allowNull: false
})

Console.hasMany(Agendamento,{
    as: 'AgendamentoConsole',
    foreignKey: 'idConsole',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Console,{
    as: 'ConsoleAgendamento',
    foreignKey: 'idConsole',
    allowNull: false
})

Cliente.hasOne(Console,{
    as: 'ConsoleCliente',
    foreignKey: 'idCliente',
    onDelete: 'CASCADE'
})

Console.belongsTo(Cliente,{
    as: 'ClienteConsole',
    foreignKey: 'idCliente',
    allowNull: false
})

module.exports = {Cliente, Console, Agendamento}