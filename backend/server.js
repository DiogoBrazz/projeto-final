// backend/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Configuração da conexão com o banco de dados
// Lendo as variáveis de ambiente que o Kubernetes fornece
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Rota para listar todos os itens
app.get('/itens', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM itens ORDER BY id DESC;');
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro ao buscar itens no banco de dados.' });
  }
});

// Rota para adicionar um novo item
app.post('/itens', async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'O nome do item é obrigatório.' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('INSERT INTO itens (nome) VALUES (?);', [nome]);
    await connection.end();
    res.status(201).json({ id: result.insertId, nome });
  } catch (error) {
    console.error('Erro ao inserir item:', error);
    res.status(500).json({ error: 'Erro ao inserir item no banco de dados.' });
  }
});

// <<< NOVA ROTA PARA DELETAR UM ITEM >>>
app.delete('/itens/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID que vem na URL (ex: /itens/5)

  try {
    const connection = await mysql.createConnection(dbConfig);
    // Executa o comando SQL para deletar o item com o ID correspondente
    const [result] = await connection.query('DELETE FROM itens WHERE id = ?;', [id]);
    await connection.end();

    // Verifica se alguma linha foi realmente afetada/deletada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }
    
    res.status(200).json({ message: 'Item deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({ error: 'Erro ao deletar item no banco de dados.' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
