const token = localStorage.getItem('token')

if(!token){
    location.href = '../index.html'
}

const btn_apagar = document.getElementById('btn_apagar')
const resposta = document.getElementById('resposta')

btn_apagar.addEventListener('click', (e) => {
    e.preventDefault()

    const id = document.getElementById('id').value

    if(!id){
        resposta.innerHTML = '<p>Informe o código do cliente!</p>'
        return
    }

    if(!confirm('Tem certeza que deseja excluir esse cliente!'))
        return

    fetch(`http://localhost:3000/cliente/${id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': token 
        },
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
        console.error('Erro ao apagar cliente!', err)
        resposta.innerHTML = '<p>Erro ao apagar cliente!</p>'
    })
})