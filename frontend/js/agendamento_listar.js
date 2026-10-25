const token = localStorage.getItem('token')

// Proteção da rota privada: se não tem token, redireciona para a Home
if (!token) {
    location.href = '../index.html'
}

let resposta = document.getElementById('resposta')
let btn_listar = document.getElementById('btn_listar')

btn_listar.addEventListener('click', (e) => {
    e.preventDefault()

    fetch('http://localhost:3000/agendamentos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
        .then(res => {
            if (!res.ok) {
                localStorage.clear()
                alert('Faça login novamente, tempo expirado!')
                location.href = '../index.html'
                throw new Error('Sessão expirada')
            }
            return res.json()
        })
        .then(dados => {
            resposta.innerHTML = ''
            resposta.innerHTML += `
            <table border="1">
                ${criarThead()}
                ${criarTbody(dados)}
            </table>
        `
        })
        .catch((err) => {
            console.error('Erro ao listar os dados', err)
            resposta.innerHTML = '<p>Erro ao conectar com o servidor.</p>'
        })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        const nomeCliente = el.ClienteAgendamento ? el.ClienteAgendamento.nome : 'N/A'
        const modeloConsole = el.ConsoleAgendamento ? `${el.ConsoleAgendamento.modelo} (MARCA ${el.ConsoleAgendamento.marca})` : 'N/A'

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

function criarThead() {
    return `
        <thead>
            <tr>
                <th>Código</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Console</th>
            </tr>
        </thead>
    `
}