// backend/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Configuração da conexão com o banco de dados
// Os valores padrão agora refletem as novas credenciais
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',          // <-- ALTERADO
  password: process.env.DB_PASSWORD || 'root',      // <-- ALTERADO
  database: process.env.DB_NAME || 'projetofinal',  // <-- ALTERADO
};

// ... o restante do arquivo continua exatamente o mesmo ...

// Função para inicializar o banco de dados e a tabela
async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await connection.query(`USE \`${dbConfig.database}\`;`);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS itens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Banco de dados e tabela verificados/criados com sucesso.');
    await connection.end();
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    // Espera um pouco e tenta novamente, comum em ambientes com container
    setTimeout(initializeDatabase, 5000);
  }
}

// Rota para listar todos os itens
app.get('/itens', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM itens ORDER BY id DESC;');
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
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
    res.status(500).json({ error: 'Erro ao inserir item no banco de dados.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
  initializeDatabase();
});