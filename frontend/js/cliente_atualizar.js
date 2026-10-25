  const token = localStorage.getItem('token')

  // Proteção da rota privada: se não houver token, redireciona para a Home
  if (!token) {
      location.href = '../index.html'
  }

  const btn_atualizar = document.getElementById('btn_atualizar')
  const resposta = document.getElementById('resposta')

  btn_atualizar.addEventListener('click', (e) => {
      e.preventDefault()

      const id = document.getElementById('id').value

      const valores = {
          nome: document.getElementById('nome').value,
          email: document.getElementById('email').value,
          senha: document.getElementById('senha').value,
          cpf: document.getElementById('cpf').value,
          telefone: document.getElementById('telefone').value
      }

      fetch(`http://localhost:3000/cliente/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token
          },
          body: JSON.stringify(valores)
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
              resposta.innerHTML = `<p>${dados.message}</p>`
              document.querySelector('form').reset()
          })
          .catch(err => {
              console.error('Erro ao atualizar ciclista:', err)
              resposta.innerHTML = '<p>Erro ao tentar conectar com o servidor.</p>'
          })
  })