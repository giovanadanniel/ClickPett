const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000; // Porta do servidor

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: '', // Substitua pelo host do seu banco
  user: 'root', // Substitua pelo usuário do seu banco
  password: '', // Substitua pela senha do seu banco
  database: 'clickpet', // Substitua pelo nome do seu banco
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados!');
});


// Rota para cadastro
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, telefone, cpf, senha } = req.body;

  console.log('Dados recebidos:', { nome, email, telefone, cpf, senha });

  // Remover formatação do CPF e telefone
  const telefoneSemFormatacao = telefone.replace(/\D/g, '');
  const cpfSemFormatacao = cpf.replace(/\D/g, '');

  console.log('Dados formatados:', { telefoneSemFormatacao, cpfSemFormatacao });

  try {
    // Criptografar a senha
    const saltRounds = 10;
    const hashedSenha = await bcrypt.hash(senha, saltRounds);

    // Inserir no banco de dados
    const sql = `
      INSERT INTO Cliente (Nome_Cliente, E_mail, CPF, Telefone, Senha, Papel)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [nome, email, cpfSemFormatacao, telefoneSemFormatacao, hashedSenha, 1]; // Papel = 1 (exemplo)

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erro ao inserir no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar cliente!' });
      }
      res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
    });
  } catch (err) {
    console.error('Erro ao criptografar a senha:', err);
    res.status(500).json({ error: 'Erro ao cadastrar cliente!' });
  }
});

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'sua_chave_secreta'; // Substitua por uma chave secreta segura

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  console.log('Tentativa de login:', { email, senha });

  try {
    const sql = `SELECT * FROM Cliente WHERE E_mail = ?`;
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuário no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao verificar login!' });
      }

      console.log('Resultados da consulta:', results);

      if (results.length === 0) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos!' });
      }

      const user = results[0];
      console.log('Usuário encontrado:', user);

      const senhaCorreta = await bcrypt.compare(senha, user.Senha);
      console.log('Senha correta:', senhaCorreta);

      if (!senhaCorreta) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos!' });
      }

      // Gerar o token JWT
      const token = jwt.sign({ id: user.ID_Cliente, nome: user.Nome_Cliente }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login realizado com sucesso!', token, user: { nome: user.Nome_Cliente } });
    });
  } catch (err) {
    console.error('Erro ao processar login:', err);
    res.status(500).json({ error: 'Erro ao processar login!' });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // O token deve ser enviado no cabeçalho Authorization: Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado!' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido!' });
    }

    req.user = user; // Adiciona os dados do usuário ao objeto da requisição
    next();
  });
};

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});