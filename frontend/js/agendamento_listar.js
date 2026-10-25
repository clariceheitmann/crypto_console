const token = localStorage.getItem('token')

if(!token){
    location.href = '../index.html'
}

let btn_listar = document.getElementById('btn_listar')
let resposta = document.getElementById('resposta')

btn_listar.addEventListener('click', (e) =>{
    e.preventDefault()

    fetch('http://localhost:3000/agendamentos',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    .then(res =>{
        if(!res.ok){
            localStorage.clear()
            alert('Faça o login novamente! Tempo expirado!')
            location.href = '../index.html'
            throw new Error('Sessão expirada!')
        }
        return res.json()
    })
    .then(dados =>{
        console.log(dados)
        resposta.innerHTML = ''
        resposta.innerHTML += `
        <table border="1">
            ${criarThead()}
            ${criarTbody(dados)}
        </table>
        `
    })
    .catch((err)=>{
        console.error('Erro ao listar agendamentos!')
        resposta.innerHTML = '<p>Erro ao listar agendamentos!</p>'
    })
})

function criarTbody(dados){
    let corpo = '<toby>'
    dados.forEach(el => {
        const nomeCliente = el.clienteAgendamento ? el.clienteAgendamento.nome : 'N/A'
        const modeloConsole = el.consoleAgendamento ? `${el.consoleAgendamento.modelo} (Marca ${el.consoleAgendamento.marca})` : 'N/A'

        corpo += `<tr>`
        corpo += `<td>${el.codAgendamento || el.id}</td>`
        corpo += `<td>${el.data}</td>`
        corpo += `<td>${el.hora}</td>`
        corpo += `<td>${nomeCliente}</td>`
        corpo += `<td>${modeloConsole}</td>`
        corpo += `</tr>`
    })
    corpo += `</tbody>`
    return corpo
}

function criarThead(){
    return `
    <thead>
        <tr>
            <th>Código do Agendamento</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Console</th>
        </tr>
    </thead>
    `
}