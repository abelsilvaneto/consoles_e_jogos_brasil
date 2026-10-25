const conn = require('./db/conn')
const {Cliente, Console, Agendamento} = require('./models/rel')

async function syncDataBase() {
    try{
        await conn.sync({force: true})
        console.log('fazendo conexão com o servidor')
    }catch(err){
        console.error('erro na operação',err)
    }finally{
        await conn.close()
        console.log('Fechando a conexão com o banco')
    }
}

syncDataBase()