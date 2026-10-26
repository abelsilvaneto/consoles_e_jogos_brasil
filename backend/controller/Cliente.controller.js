// criado para gerenciar os dados do cliente e operacoes
const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')

const CHAVE_SEGREDO = 'CHAVE_BAIXA'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.telefone) {
        return res.status(400).json({message: 'Todos os campos são obrigatórios!'})
    }

    try {

        const senhaCriptografada = CryptoJS.AES.encrypt( valores.senha,CHAVE_SEGREDO).toString()
        const cpfCriptografado = CryptoJS.AES.encrypt( valores.cpf,CHAVE_SEGREDO).toString()

        await Ciclista.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada,
            cpf: cpfCriptografado,
            telefone: valores.telefone
        })

        return res.status(201).json({message: 'Cliente cadastrado com sucesso!'})
    } catch (err) {
        console.error('Erro ao cadastrar cliente:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar cliente!' })
    }
}

const listar = async (req, res) => {
    try {
        const clientes = await Cliente.findAll()
        let resultado = []

        clientes.forEach((el)=>{
            let cpfDescriptografado = ''
            try{
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
                cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            }catch(err){
                cpfDescriptografado = 'Erro ao descriptografar'
                console.error(cpfDescriptografado, err)
            }
            resultado.push({
                codCiclista: el.codCiclista,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                telefone: el.telefone
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Erro ao listar', err)
        return res.status(500).json({ message: 'Erro ao listar' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'cliente não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        console.log('bytes = ',bytes)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
        console.log('cpf descriptografado = ',cpfDescriptografado)

        return res.status(200).json({
            codCiclista: cliente.codCiclista,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDescriptografado,
            telefone: cliente.telefone
        })
    } catch (err) {
        console.error('Erro ao consultar: ', err)
        return res.status(500).json({ message: 'Erro ao consultar: ' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        const dadosAtualizados = { ...valores }

        if (valores.cpf) {
            if (valores.cpf.length !== 11) {
                return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
            }
            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }
        
        if (valores.senha) {
            dadosAtualizados.senha = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        }

        await Cliente.update(dadosAtualizados, { where: { codCliente: id } })
        return res.status(200).json({ message: 'Cliente atualizado com sucesso!' })
    } catch (err) {
        console.error('Erro ao atualizar Cliente:', err)
        return res.status(500).json({ message: 'Erro ao atualizar Cliente!' })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        await Cliente.destroy({ where: { codCliente: id } })
        return res.status(200).json({ message: 'Cliente excluído com sucesso!' })
    } catch (err) {
        console.error('Erro ao apagar Cliente:', err)
        return res.status(500).json({ message: 'Erro ao apagar Cliente' })
    }
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar }
