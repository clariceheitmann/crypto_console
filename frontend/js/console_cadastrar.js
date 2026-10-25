const token = localStorage.getItem('token')

if(!token){
    location.href = '../index.html'
}

const btn_cadastrar = document.getElementById('btn_cadastrar')
const resposta = document.getElementById('resposta')

btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    const valores = {
        modelo: document.getElementById('modelo').value,
        marca: document.getElementById('marca').value,
        numeroSerie: document.getElementById('numeroSerie').value,
        tipoServico: document.getElementById('tipoServico').value,
        idCliente: document.getElementById('idCliente').value
    }

    fetch('http://localhost:3000/console', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': token 
        },
        body: JSON.stringify(valores)
    })
    .then(res => {
        if(!res.ok){
            localStorage.clear()
            alert('Faça o login novamente! Tempo expirado!')
            location.href = '../index.html'
            throw new Error('Sessão expirada!')
        }
        return res.json()
    })
    .then(dados => {
        resposta.innerHTML = `<p>${dados.message}</p>`
        document.querySelector('form').reset()
    })
    .catch(err => {
        console.error('Erro ao cadastrar console!', err)
        resposta.innerHTML = '<p>Erro ao cadastrar console!</p>'
    })
})