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
    console.error('Token não fornecido.');
    return res.status(401).json({ error: 'Acesso negado!' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Erro ao verificar token:', err);
      return res.status(403).json({ error: 'Token inválido!' });
    }

    console.log('Token decodificado:', user);

    // Verificar se o usuário ainda existe no banco de dados
    const sql = `SELECT * FROM Cliente WHERE ID_Cliente = ?`;
    db.query(sql, [user.id], (dbErr, results) => {
      if (dbErr) {
        console.error('Erro ao verificar usuário no banco de dados:', dbErr);
        return res.status(500).json({ error: 'Erro interno no servidor!' });
      }

      if (results.length === 0) {
        console.error('Usuário não encontrado no banco de dados.');
        return res.status(404).json({ error: 'Usuário não encontrado!' });
      }

      console.log('Usuário autenticado:', results[0]);
      req.user = user; // Adicionar os dados do usuário à requisição
      next();
    });
  });
};

app.get('/api/usuario', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = `SELECT Nome_Cliente AS nome, E_mail AS email, Telefone AS telefone, CPF AS cpf FROM Cliente WHERE ID_Cliente = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar dados do usuário!' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    res.status(200).json(results[0]);
  });
});

app.put('/api/usuario', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { nome, email, telefone, cpf } = req.body;

  const sql = `UPDATE Cliente SET Nome_Cliente = ?, E_mail = ?, Telefone = ?, CPF = ? WHERE ID_Cliente = ?`;
  db.query(sql, [nome, email, telefone, cpf, userId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar dados do usuário:', err);
      return res.status(500).json({ error: 'Erro ao atualizar dados do usuário!' });
    }

    res.status(200).json({ message: 'Dados atualizados com sucesso!' });
  });
});

app.delete('/api/usuario', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = `DELETE FROM Cliente WHERE ID_Cliente = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir a conta:', err);
      return res.status(500).json({ error: 'Erro ao excluir a conta!' });
    }

    res.status(200).json({ message: 'Conta excluída com sucesso!' });
  });
});

app.post('/api/cadastrar-pet', authenticateToken, (req, res) => {
  let { nome, idade, peso, raca } = req.body;
  const clienteId = req.user.id;

  console.log('Dados recebidos para cadastro de pet:', { nome, idade, peso, raca, clienteId });

  if (!clienteId) {
    console.error('Erro: ID do cliente não encontrado no token.');
    return res.status(400).json({ error: 'ID do cliente não encontrado!' });
  }

  // Validar e formatar o peso
  if (typeof peso === 'string') {
    peso = parseFloat(peso.replace(',', '.'));
  } else if (typeof peso === 'number') {
    peso = parseFloat(peso.toString());
  } else {
    console.error('Erro: Peso inválido.');
    return res.status(400).json({ error: 'Peso inválido!' });
  }

  console.log('Peso formatado:', peso);

  const sql = `
    INSERT INTO Pet (Nome_Pet, Idade, Peso, Raca, fk_Cliente__ID_Cliente)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [nome, idade, peso, raca, clienteId];

  console.log('Valores para inserção no banco de dados:', values);

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_NO_REFERENCED_ROW_2') {
        console.error('Erro: Cliente não encontrado no banco de dados.');
        return res.status(400).json({ error: 'Cliente não encontrado!' });
      }
      console.error('Erro ao cadastrar pet no banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar pet!' });
    }
    console.log('Pet cadastrado com sucesso:', result);
    res.status(200).json({ message: 'Pet cadastrado com sucesso!' });
  });
});

app.get('/api/meus-pets', authenticateToken, (req, res) => {
  const clienteId = req.user.id;

  const sql = `SELECT ID_Pet AS id, Nome_Pet AS nome, Idade AS idade, Peso AS peso, Raca AS raca FROM Pet WHERE fk_Cliente__ID_Cliente = ?`;
  db.query(sql, [clienteId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar pets do usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar pets!' });
    }

    res.status(200).json(results);
  });
});

app.delete('/api/pet/:id', authenticateToken, (req, res) => {
  const petId = req.params.id;
  const clienteId = req.user.id;

  const sql = `DELETE FROM Pet WHERE ID_Pet = ? AND fk_Cliente__ID_Cliente = ?`;
  db.query(sql, [petId, clienteId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir pet:', err);
      return res.status(500).json({ error: 'Erro ao excluir pet!' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pet não encontrado!' });
    }

    res.status(200).json({ message: 'Pet excluído com sucesso!' });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});