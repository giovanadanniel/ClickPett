const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000; // Porta do servidor
const SECRET_KEY = 'sua_chave_secreta'; // Substitua por uma chave secreta segura

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

// Configuração do CORS
const corsOptions = {
  origin: '*', // Permitir todas as origens
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// Rota para cadastro
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, telefone, cpf, senha } = req.body;

  // Remover formatação do CPF e telefone
  const telefoneSemFormatacao = telefone.replace(/\D/g, '');
  const cpfSemFormatacao = cpf.replace(/\D/g, '');

  // Validação: CPF deve ter exatamente 11 dígitos
  if (!/^[0-9]{11}$/.test(cpfSemFormatacao)) {
    return res.status(400).json({ error: 'CPF deve conter exatamente 11 dígitos numéricos.' });
  }

  // Verificar se o e-mail já existe
  db.query('SELECT 1 FROM Cliente WHERE E_mail = ?', [email], async (err, results) => {
    if (err) {
      console.error('Erro ao verificar e-mail:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar cliente!' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado!' });
    }

    // Verificar se o CPF já existe
    db.query('SELECT 1 FROM Cliente WHERE CPF = ?', [cpfSemFormatacao], async (err, results) => {
      if (err) {
        console.error('Erro ao verificar CPF:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar cliente!' });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: 'CPF já cadastrado!' });
      }

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
  });
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const sql = `SELECT * FROM Cliente WHERE E_mail = ?`;
    db.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao verificar login!' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos!' });
      }

      const user = results[0];
      const senhaCorreta = await bcrypt.compare(senha, user.Senha);

      if (!senhaCorreta) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos!' });
      }

      // Gerar o token JWT com o papel do usuário
      const token = jwt.sign(
        { id: user.ID_Cliente, nome: user.Nome_Cliente, papel: user.Papel },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Login realizado com sucesso!',
        token,
        user: { id: user.ID_Cliente, nome: user.Nome_Cliente, papel: user.Papel },
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar login!' });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.error('Token não fornecido.');
    return res.status(401).json({ error: 'Acesso negado! Token não encontrado.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.error('Token expirado:', err);
        return res.status(403).json({ error: 'Token expirado!' });
      }
      console.error('Erro ao verificar token:', err);
      return res.status(403).json({ error: 'Token inválido!' });
    }

    // Verificar se o usuário ainda existe no banco de dados
    const sql = `SELECT ID_Cliente FROM Cliente WHERE ID_Cliente = ?`;
    db.query(sql, [user.id], (dbErr, results) => {
      if (dbErr) {
        console.error('Erro ao verificar existência do usuário:', dbErr);
        return res.status(500).json({ error: 'Erro interno do servidor!' });
      }

      if (results.length === 0) {
        console.warn(`Usuário com ID ${user.id} não encontrado no banco de dados.`);
        return res.status(401).json({ error: 'Acesso negado! Usuário não encontrado.' });
      }

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

app.put('/api/usuario', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { nome, email, telefone, cpf, senha } = req.body;

  try {
    // Atualizar os dados do usuário
    const sql = `UPDATE Cliente SET Nome_Cliente = ?, E_mail = ?, Telefone = ?, CPF = ? WHERE ID_Cliente = ?`;
    await db.promise().query(sql, [nome, email, telefone, cpf, userId]);

    // Atualizar a senha, se fornecida
    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      const sqlSenha = `UPDATE Cliente SET Senha = ? WHERE ID_Cliente = ?`;
      await db.promise().query(sqlSenha, [senhaHash, userId]);
    }

    res.status(200).json({ message: 'Dados atualizados com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar dados do usuário:', err);
    res.status(500).json({ error: 'Erro ao atualizar dados do usuário!' });
  }
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
  const { nome, dataNascimento, peso, raca } = req.body;
  const clienteId = req.user.id;

  if (!nome || !dataNascimento || !peso || !raca) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  const diffTime = hoje.getTime() - nascimento.getTime();

  if (diffTime < 0) {
    return res.status(400).json({ error: 'A data de nascimento não pode ser no futuro!' });
  }

  const diffDays = diffTime / (1000 * 3600 * 24);
  let idade;
  if (diffDays < 30) {
    idade = `${Math.floor(diffDays)} dias`;
  } else if (diffDays < 365) {
    idade = `${Math.floor(diffDays / 30)} meses`;
  } else {
    idade = `${Math.floor(diffDays / 365)} anos`;
  }

  const sql = `
    INSERT INTO Pet (Nome_Pet, Dt_Nasc, Idade, Peso, Raca, fk_Cliente__ID_Cliente)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [nome, dataNascimento, idade, peso, raca, clienteId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar pet no banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar pet!' });
    }
    res.status(200).json({ message: 'Pet cadastrado com sucesso!' });
  });
});

app.get('/api/meus-pets', authenticateToken, (req, res) => {
  const clienteId = req.user.id;

  console.log(`Buscando pets para o cliente ID = ${clienteId}`); // Log para depuração

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

  console.log(`Tentativa de exclusão: Pet ID = ${petId}, Cliente ID = ${clienteId}`); // Log para depuração

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

app.get('/api/pet/:id', authenticateToken, (req, res) => {
  const petId = req.params.id;
  const clienteId = req.user.id;

  const sql = `SELECT ID_Pet AS id, Nome_Pet AS nome, Dt_Nasc AS dataNascimento, Idade AS idade, Peso AS peso, Raca AS raca 
               FROM Pet WHERE ID_Pet = ? AND fk_Cliente__ID_Cliente = ?`;
  db.query(sql, [petId, clienteId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar informações do pet:', err);
      return res.status(500).json({ error: 'Erro ao buscar informações do pet!' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Pet não encontrado!' });
    }

    res.status(200).json(results[0]);
  });
});

app.put('/api/pet/:id', authenticateToken, (req, res) => {
  const petId = req.params.id;
  const clienteId = req.user.id;
  const { nome, dataNascimento, peso, raca } = req.body;

  if (!nome || !dataNascimento || !peso || !raca) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  const diffTime = hoje.getTime() - nascimento.getTime();

  if (diffTime < 0) {
    return res.status(400).json({ error: 'A data de nascimento não pode ser no futuro!' });
  }

  const diffDays = diffTime / (1000 * 3600 * 24);
  let idade;
  if (diffDays < 30) {
    idade = `${Math.floor(diffDays)} dias`;
  } else if (diffDays < 365) {
    idade = `${Math.floor(diffDays / 30)} meses`;
  } else {
    idade = `${Math.floor(diffDays / 365)} anos`;
  }

  const sql = `UPDATE Pet SET Nome_Pet = ?, Dt_Nasc = ?, Idade = ?, Peso = ?, Raca = ? 
               WHERE ID_Pet = ? AND fk_Cliente__ID_Cliente = ?`;
  db.query(sql, [nome, dataNascimento, idade, peso, raca, petId, clienteId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar informações do pet:', err);
      return res.status(500).json({ error: 'Erro ao atualizar informações do pet!' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pet não encontrado!' });
    }

    res.status(200).json({ message: 'Pet atualizado com sucesso!' });
  });
});

app.post('/api/cadastrar-servico', authenticateToken, (req, res) => {
  const { nomeServico, precoServico, clienteId } = req.body; // Receber o clienteId do corpo da requisição

  if (!clienteId) {
    console.error('ID do cliente não fornecido.');
    return res.status(400).json({ error: 'ID do cliente é obrigatório!' });
  }

  console.log('Dados recebidos para cadastro de serviço:', { nomeServico, precoServico, clienteId });

  if (!nomeServico || !precoServico || isNaN(precoServico) || precoServico <= 0) {
    return res.status(400).json({ error: 'Nome e preço do serviço são obrigatórios e o preço deve ser um número positivo!' });
  }

  const sql = `INSERT INTO Servicos (Nome_Servico, Preco_Servico) VALUES (?, ?)`;
  const values = [nomeServico, precoServico];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar serviço no banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar serviço!' });
    }

    console.log('Serviço cadastrado com sucesso:', result);
    res.status(200).json({ message: 'Serviço cadastrado com sucesso!' });
  });
});

app.get('/api/meus-servicos', authenticateToken, (req, res) => {
  const clienteId = req.query.clienteId; // Receber o ID do cliente como parâmetro da requisição

  if (!clienteId) {
    console.error('ID do cliente não fornecido.');
    return res.status(400).json({ error: 'ID do cliente é obrigatório!' });
  }

  console.log(`Buscando serviços cadastrados pelo cliente ID = ${clienteId}`); // Log para depuração

  const sql = `SELECT ID_Servicos AS id, Nome_Servico AS nome, CAST(Preco_Servico AS DECIMAL(10,2)) AS preco 
               FROM Servicos`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar serviços:', err);
      return res.status(500).json({ error: 'Erro ao buscar serviços!' });
    }

    if (results.length === 0) {
      console.warn(`Nenhum serviço encontrado para o cliente ID = ${clienteId}`); // Log de aviso
      return res.status(404).json({ error: 'Nenhum serviço encontrado!' });
    }

    console.log('Serviços encontrados:', results); // Log dos serviços retornados
    res.status(200).json(results);
  });
});

app.post('/api/refresh-token', authenticateToken, (req, res) => {
  const user = req.user; // Dados do usuário decodificados do token antigo

  if (!user || !user.id) {
    return res.status(403).json({ error: 'Não foi possível renovar o token.' });
  }

  // Gere um novo token
  const newToken = jwt.sign({ id: user.id, nome: user.nome }, SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({ token: newToken });
});

// Rota para checar se CPF já existe
app.get('/api/cadastro', (req, res) => {
  const cpf = req.query.cpf;
  if (!cpf) {
    return res.status(400).json({ error: 'CPF não fornecido!' });
  }
  db.query('SELECT 1 FROM Cliente WHERE CPF = ?', [cpf], (err, results) => {
    if (err) {
      console.error('Erro ao verificar CPF:', err);
      return res.status(500).json({ error: 'Erro ao verificar CPF!' });
    }
    if (results.length > 0) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  });
});

// Adição de logs detalhados
app.use((req, res, next) => {
  console.log(`Requisição recebida: ${req.method} ${req.url}`);
  next();
});

// Rota para excluir um serviço
app.delete('/api/servico/:id', authenticateToken, (req, res) => {
  const servicoId = req.params.id;

  console.log(`Tentativa de exclusão: Serviço ID = ${servicoId}`); // Log para depuração

  const sql = `DELETE FROM Servicos WHERE ID_Servicos = ?`;
  db.query(sql, [servicoId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir serviço:', err);
      return res.status(500).json({ error: 'Erro ao excluir serviço!' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Serviço não encontrado!' });
    }

    res.status(200).json({ message: 'Serviço excluído com sucesso!' });
  });
});

// Rota para buscar os dados de um serviço pelo ID
app.get('/api/servico/:id', authenticateToken, (req, res) => {
  const servicoId = req.params.id;

  console.log(`Buscando informações do serviço: Serviço ID = ${servicoId}`); // Log para depuração

  const sql = `SELECT ID_Servicos AS id, Nome_Servico AS nome, Preco_Servico AS preco 
               FROM Servicos WHERE ID_Servicos = ?`;
  db.query(sql, [servicoId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar informações do serviço:', err);
      return res.status(500).json({ error: 'Erro ao buscar informações do serviço!' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Serviço não encontrado!' });
    }

    res.status(200).json(results[0]);
  });
});

// Rota para editar um serviço
app.put('/api/servico/:id', authenticateToken, (req, res) => {
  const servicoId = req.params.id;
  const { nomeServico, precoServico } = req.body;

  console.log(`Tentativa de edição: Serviço ID = ${servicoId}`); // Log para depuração

  const sql = `UPDATE Servicos SET Nome_Servico = ?, Preco_Servico = ? WHERE ID_Servicos = ?`;
  db.query(sql, [nomeServico, precoServico, servicoId], (err, result) => {
    if (err) {
      console.error('Erro ao editar serviço:', err);
      return res.status(500).json({ error: 'Erro ao editar serviço!' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Serviço não encontrado!' });
    }

    res.status(200).json({ message: 'Serviço atualizado com sucesso!' });
  });
});

// Rota para buscar todos os serviços disponíveis
app.get('/api/servicos', authenticateToken, (req, res) => {
  const sql = `SELECT ID_Servicos AS id, Nome_Servico AS nome FROM Servicos`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar serviços:', err);
      return res.status(500).json({ error: 'Erro ao buscar serviços!' });
    }
    res.status(200).json(results);
  });
});

// Rota para criar um agendamento
app.post('/api/agendamento', authenticateToken, (req, res) => {
  const { dataHora, observacao, servicoId, petId } = req.body;

  // Validar os dados recebidos
  if (!dataHora || !servicoId || !petId) {
    return res.status(400).json({ error: 'Data, serviço e pet são obrigatórios!' });
  }

  const sql = `
    INSERT INTO Agendamento (Data_Hora, Observacao, fk_Servicos__ID_Servicos, fk_Pet_ID_Pet)
    VALUES (?, ?, ?, ?)
  `;
  const values = [dataHora, observacao, servicoId, petId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao criar agendamento:', err);
      return res.status(500).json({ error: 'Erro ao criar agendamento!' });
    }
    res.status(200).json({ message: 'Agendamento criado com sucesso!' });
  });
});

// Rota para buscar os agendamentos do usuário logado
app.get('/api/meus-agendamentos', authenticateToken, (req, res) => {
  const clienteId = req.user.id;

  const sql = `
    SELECT 
      Agendamento.ID_Agendamento AS id,
      Agendamento.Data_Hora AS dataHora,
      Agendamento.Observacao AS observacao,
      Servicos.Nome_Servico AS servico,
      Servicos.Preco_Servico AS preco,
      Pet.Nome_Pet AS pet
    FROM Agendamento
    INNER JOIN Servicos ON Agendamento.fk_Servicos__ID_Servicos = Servicos.ID_Servicos
    INNER JOIN Pet ON Agendamento.fk_Pet_ID_Pet = Pet.ID_Pet
    WHERE Pet.fk_Cliente__ID_Cliente = ?
  `;

  db.query(sql, [clienteId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamentos:', err);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos!' });
    }
    res.status(200).json(results);
  });
});

// Rota para buscar os dados de um agendamento pelo ID
app.get('/api/agendamento/:id', authenticateToken, (req, res) => {
  const agendamentoId = req.params.id;

  const sql = `
    SELECT 
      Agendamento.ID_Agendamento AS id,
      Agendamento.Data_Hora AS dataHora,
      Agendamento.Observacao AS observacao,
      Servicos.ID_Servicos AS servicoId,
      Servicos.Nome_Servico AS servico,
      Pet.ID_Pet AS petId,
      Pet.Nome_Pet AS pet
    FROM Agendamento
    INNER JOIN Servicos ON Agendamento.fk_Servicos__ID_Servicos = Servicos.ID_Servicos
    INNER JOIN Pet ON Agendamento.fk_Pet_ID_Pet = Pet.ID_Pet
    WHERE Agendamento.ID_Agendamento = ?
  `;

  db.query(sql, [agendamentoId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamento:', err);
      return res.status(500).json({ error: 'Erro ao buscar agendamento!' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado!' });
    }

    res.status(200).json(results[0]);
  });
});

// Rota para atualizar os dados de um agendamento
app.put('/api/agendamento/:id', authenticateToken, (req, res) => {
  const agendamentoId = req.params.id;
  const { dataHora, observacao, servicoId, petId } = req.body;

  const sql = `
    UPDATE Agendamento
    SET Data_Hora = ?, Observacao = ?, fk_Servicos__ID_Servicos = ?, fk_Pet_ID_Pet = ?
    WHERE ID_Agendamento = ?
  `;

  const values = [dataHora, observacao, servicoId, petId, agendamentoId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar agendamento:', err);
      return res.status(500).json({ error: 'Erro ao atualizar agendamento!' });
    }

    res.status(200).json({ message: 'Agendamento atualizado com sucesso!' });
  });
});

app.delete('/api/agendamento/:id', authenticateToken, (req, res) => {
  const agendamentoId = req.params.id;

  const sql = `DELETE FROM Agendamento WHERE ID_Agendamento = ?`;
  db.query(sql, [agendamentoId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir agendamento:', err);
      return res.status(500).json({ error: 'Erro ao excluir agendamento!' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado!' });
    }

    res.status(200).json({ message: 'Agendamento excluído com sucesso!' });
  });
});

app.post('/api/verificar-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-mail não fornecido!' });
  }

  db.query('SELECT 1 FROM Cliente WHERE E_mail = ?', [email], (err, results) => {
    if (err) {
      console.error('Erro ao verificar e-mail:', err);
      return res.status(500).json({ error: 'Erro ao verificar e-mail!' });
    }

    if (results.length > 0) {
      return res.json({ existe: true });
    }

    res.json({ existe: false });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});