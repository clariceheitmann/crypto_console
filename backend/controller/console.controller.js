const Console = require('../models/Console')
const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if(!valores.modelo || !valores.marca || !valores.numeroSerie || !valores.tipoServico || !valores.idCliente){
        return res.status(400).json({message: 'Preencha todos os campos!'})
    }

    try {
        const numeroSerieCriptografado = CryptoJS.AES.encrypt(valores.numeroSerie, CHAVE_SECRETA).toString()

        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        const novoConsole = await Console.create({
            modelo: valores.modelo,
            marca: valores.marca,
            numeroSerie: numeroSerieCriptografado,     
            tipoServico: valores.tipoServico,
            idCliente: valores.idCliente
        })


        return res.status(201).json({ message: 'Console cadastrado com sucesso!', console: novoConsole })
    } catch (err) {
        console.error('Erro ao cadastrar console!',err)
        return res.status(500).json({ message: 'Erro ao cadastrar console!'})
    }
}

const listar = async(req,res) =>{
    try{
        const consoles = await Console.findAll()
        let resultado = []

        consoles.forEach((el)=>{
            let numeroSerieDescriptografado = ''
            try{
                const bytes = CryptoJS.AES.decrypt(el.numeroSerie, CHAVE_SECRETA)
                numeroSerieDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            }catch(err){
                numeroSerieDescriptografado = 'Erro ao descriptografar!'
                console.error(numeroSerieDescriptografado, err)
            }
            resultado.push({
                modelo: el.modelo,
                marca: el.marca,
                numeroSerie: numeroSerieDescriptografado,
                tipoServico: el.tipoServico,
                idCliente: el.idCliente
            })
        })
        return res.status(200).json(resultado)
    }catch (err) {
        console.error('Erro ao listar consoles!',err)
        return res.status(500).json({ message: 'Erro ao listar consoles!'})
    }
}

module.exports = {cadastrar, listar}