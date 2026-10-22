const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

// ===== CLIENTE =====
const cadastrar = async (req, res) => {
    const valores = req.body

    if(!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.telefone){
        return res.status(400).json({message: 'Preencha todos os campos!'})
    }

    if(valores.cpf.length !== 11){
        return res.status(400).json({message: 'O CPF deve conter 11 números'})
    }

    try {
        const senhaCriptografada = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()

        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada, 
            cpf: cpfCriptografado,     
            telefone: valores.telefone
        })
        return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' })
    } catch (err) {
        console.error('Erro ao cadastrar cliente!',err)
        return res.status(500).json({ message: 'Erro ao cadastrar cliente!'})
    }
}

const listar = async(req,res) =>{
    try{
        const clientes = await Cliente.findAll()
        let resultado = []

        clientes.forEach((el)=>{
            let cpfDescriptografado = ''
            try{
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
                cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            }catch(err){
                cpfDescriptografado = 'Erro ao descriptografar!'
                console.error(cpfDescriptografado, err)
            }
            resultado.push({
                codCliente: el.codCliente,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                telefone: el.telefone
            })
        })
        return res.status(200).json(resultado)
    }catch (err) {
        console.error('Erro ao listar clientes!',err)
        return res.status(500).json({ message: 'Erro ao listar clientes!'})
    }
}

const consultar = async(req,res) =>{
    const id = req.params.id 

    try{
        const cliente = await Cliente.findByPk(id)
        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        const bytes = CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        console.log('bytes =', bytes)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
        console.log('cpf descriptografado =', cpfDescriptografado)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDescriptografado,
            telefone: cliente.telefone
        })
    }catch (err) {
        console.error('Erro ao consultar cliente!',err)
        return res.status(500).json({ message: 'Erro ao consultar cliente!'})
    }
}


const atualizar = async (req, res) => {
    const valores = req.body
    console.log('Corpo recebido:', req.body)
console.log('Content-Type:', req.headers['content-type'])
    const id = req.params.id

    // Verifica se o corpo da requisição foi enviado
    if (!valores) {
        return res.status(400).json({
            message: 'Envie os dados do cliente no corpo da requisição!'
        })
    }

    // Verifica se todos os campos foram preenchidos
    if (!valores.nome || !valores.email || !valores.senha ||
        !valores.cpf || !valores.telefone) {
        return res.status(400).json({
            message: 'Preencha todos os campos!'
        })
    }

    // Verifica se o CPF possui 11 caracteres
    if (valores.cpf.length !== 11) {
        return res.status(400).json({
            message: 'O CPF deve conter 11 números'
        })
    }

    try {
        const cliente = await Cliente.findByPk(id)

        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente não encontrado!'
            })
        }

        // Criptografa novamente a senha e o CPF
        const dadosAtualizados = {
            nome: valores.nome,
            email: valores.email,
            senha: CryptoJS.AES.encrypt(
                valores.senha, CHAVE_SECRETA
            ).toString(),
            cpf: CryptoJS.AES.encrypt(
                valores.cpf, CHAVE_SECRETA
            ).toString(),
            telefone: valores.telefone
        }

        await Cliente.update(dadosAtualizados, {
            where: { codCliente: id }
        })

        return res.status(200).json({
            message: 'Cliente atualizado com sucesso!'
        })

    } catch (err) {
        console.error('Erro ao atualizar cliente!', err)
        return res.status(500).json({
            message: 'Erro ao atualizar cliente!'
        })
    }
}


const apagar = async(req,res) =>{
    const id = req.params.id 

    try{
        const cliente = await Cliente.findByPk(id)
        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        await Cliente.destroy({where: {codCliente: id}})
        return res.status(200).json({message: 'Cliente excluído com sucesso!'})
    }catch (err) {
        console.error('Erro ao excluir cliente!',err)
        return res.status(500).json({ message: 'Erro ao excluir cliente!'})
    }
}

module.exports = {cadastrar, listar, consultar, atualizar, apagar}