// A URL agora é um caminho relativo, que será redirecionado pelo Nginx para o backend.
const apiUrl = '/api/itens';

// Função para buscar e exibir os itens na lista
async function listarItens() {
  const lista = document.getElementById('listaItens');
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Erro na requisição: ' + response.statusText);
    }
    const itens = await response.json();
    lista.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens
    
    itens.forEach(item => {
      const li = document.createElement('li');
      
      // <<< ATUALIZADO: Cria o HTML do item com o botão de deletar >>>
      // Usamos o 'id' do item na chamada da função deletarItem
      li.innerHTML = `
        <span>${item.nome}</span>
        <button class="delete-btn" onclick="deletarItem(${item.id})">Deletar</button>
      `;
      
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Falha ao buscar itens:', error);
    lista.innerHTML = '<li>Não foi possível carregar os itens.</li>';
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

// <<< NOVA FUNÇÃO PARA DELETAR UM ITEM >>>
async function deletarItem(id) {
  // Pede confirmação ao usuário antes de deletar
  if (!confirm('Tem certeza de que deseja deletar este item?')) {
    return;
  }

  try {
    // Faz a chamada para a API usando o método DELETE e passando o ID na URL
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar item.');
    }

    console.log('Item deletado com sucesso');
    listarItens(); // Atualiza a lista na tela para remover o item deletado
  } catch (error) {
    console.error('Falha ao deletar item:', error);
    alert('Não foi possível deletar o item.');
  }
}

// Carrega a lista de itens assim que a página é carregada
document.addEventListener('DOMContentLoaded', listarItens);
