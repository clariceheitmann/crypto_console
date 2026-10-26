const token = localStorage.getItem('token')

if(!token){
    location.href = '../index.html'
}

let btn_listar = document.getElementById('btn_listar')
let resposta = document.getElementById('resposta')

btn_listar.addEventListener('click', (e) =>{
    e.preventDefault()

    fetch('http://localhost:3000/consoles',{
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
        <table>
            ${criarThead()}
            ${criarTbody(dados)}
        </table>
        `
    })
    .catch((err)=>{
        console.error('Erro ao listar consoles!')
        resposta.innerHTML = '<p>Erro ao listar consoles!</p>'
    })
})

function criarTbody(dados){
    let corpo = '<tbody>'

    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.idCliente}</td>`
        corpo += `<td>${el.modelo}</td>`
        corpo += `<td>${el.marca}</td>`
        corpo += `<td>${el.numeroSerie}</td>`
        corpo += `<td>${el.tipoServico}</td>`
        corpo += `</tr>`
    })

    corpo += `</tbody>`
    return corpo
}

function criarThead(){
    return `
    <thead>
        <tr>
            <th>Código do Cliente</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Número Série</th>
            <th>Tipo de Serviço</th>
        </tr>
    </thead>
    `
}