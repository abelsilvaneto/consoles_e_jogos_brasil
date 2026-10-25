const CryptoJs = require('crypto-js')
const CHAVE_SEGREDO = 'CHAVE_BAIXA'

function authMiddleware(req,res,next){
    const token = req.headers['authorization']
    console.log(token)

    if(!token){
        return res.status(401).json({message: 'Acesso negado! token não fornecido'})
    }

    try{
       const bytes = CryptoJs.AES.decrypt(token,CHAVE_SEGREDO)
       const dadosDescriptacao = bytes.toString(CryptoJs.enc.Utf8)

       if(!dadosDescriptacao){
        return res.status(201).json({message: 'Token invalido'})
       }

       const payload = JSON.parse(dadosDescriptacao)

       if(date.now() > payload.expiraEm){
        return res.status(401).json({message: 'Sessão expirada! faça login novamento'})
       }

       next()
    }catch(err){
        return res.status(500).json({message: 'Falha na autenticação do token'})
    }
}

module.exports = authMiddleware