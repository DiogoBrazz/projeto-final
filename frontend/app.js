// frontend/app.js
const apiUrl = '/api/itens'; 

// Função para buscar e exibir os itens na lista
async function listarItens() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Erro na requisição: ' + response.statusText);
    }
    const itens = await response.json();
    const lista = document.getElementById('listaItens');
    lista.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens

    itens.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.nome;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Falha ao buscar itens:', error);
    alert('Não foi possível carregar os itens.');
  }
}

// Função para adicionar um novo item
async function adicionarItem() {
  const input = document.getElementById('itemInput');
  const nomeItem = input.value;

  if (!nomeItem) {
    alert('Por favor, digite o nome do item.');
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: nomeItem }),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar item.');
    }

    input.value = ''; // Limpa o campo de input
    listarItens(); // Atualiza a lista na tela
  } catch (error) {
    console.error('Falha ao adicionar item:', error);
    alert('Não foi possível adicionar o item.');
  }
}

// Carrega a lista de itens assim que a página é carregada
document.addEventListener('DOMContentLoaded', listarItens);