const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const btn_consultar = document.getElementById('btn_consultar')
const resposta = document.getElementById('resposta')

btn_consultar.addEventListener('click', (e) => {
    e.preventDefault()

    const numeroSerie = document.getElementById('numeroSerie').value

    fetch(`http://localhost:3000/console/termo/${numeroSerie}`, {
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
            if (dados.message) {
                resposta.innerHTML = `<p>${dados.message}</p>`
            } else {
                resposta.innerHTML = ''
                resposta.innerHTML += `
                <table>
                    ${criarThead()}
                    ${criarTbody([dados])}
                </table>
                `
            }
        })
        .catch(err => {
            console.error('Erro ao consultar:', err)
            resposta.innerHTML = '<p>Erro ao conectar com o servidor.</p>'
        })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codConsole || el.id}</td>`
        corpo += `<td>${el.modelo}</td>`
        corpo += `<td>${el.marca}</td>`
        corpo += `<td>${el.numeroSerie}</td>`
        corpo += `<td>${el.tipoServico}</td>`
        corpo += `<td>${el.idCliente}</td>`
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
                <th>modelo</th>
                <th>marca</th>
                <th>numeroSerie</th>
                <th>tipoServico</th>
                <th>idCliente</th>
            </tr>
        </thead>
    `
}
