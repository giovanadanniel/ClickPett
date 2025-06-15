import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import './style.css';
import { useNavigate } from 'react-router-dom';

export default function EditarConta() {
  useEffect(() => {
    document.title = 'Editar Conta - Click Pet';
  }, []);

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: '',
  });

  const token = localStorage.getItem('token'); // Recuperar o token do usuário logado
  const navigate = useNavigate(); // Para redirecionar após salvar as alterações

  // Verificação de autenticação e autorização
  useEffect(() => {
    const token = localStorage.getItem('token');
    const papelUsuario = localStorage.getItem('papelUsuario');

    if (!token || (papelUsuario !== '1' && papelUsuario !== '2')) {
      navigate('/');
    }
  }, [navigate]);

  // Função para buscar os dados do usuário logado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/usuario', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar os dados do usuário!');
        }

        const data = await response.json();
        setForm({
          nome: data.nome,
          email: data.email,
          telefone: formatarTelefone(data.telefone),
          cpf: data.cpf ? formatarCPF(data.cpf) : '',
          senha: '', // Não exibir a senha
        });
      } catch (error: any) {
        Swal.fire({ title: 'Erro', text: error.message, icon: 'error', background: '#fff', color: '#000' });
      }
    };

    fetchUserData();
  }, [token]);

  // Função para formatar telefone
const formatarTelefone = (telefone: string) => {
  if (!telefone) return ''; // Retorna uma string vazia se telefone for null ou undefined
  return telefone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
};

// Função para formatar CPF
const formatarCPF = (cpf: string) => {
  if (!cpf) return ''; // Retorna uma string vazia se cpf for null ou undefined
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  const { nome, email, telefone, senha } = form;

  // Validação de nome: mínimo 3 letras e apenas letras
  const nomeRegex = /^[a-zA-Z\s]{3,}$/;
  if (!nomeRegex.test(nome)) {
    return Swal.fire({
      title: 'Erro',
      text: 'O nome deve conter no mínimo 3 letras e apenas caracteres alfabéticos!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Swal.fire({
      title: 'Erro',
      text: 'Digite um e-mail válido!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Verificar se o e-mail foi alterado e já existe no banco de dados
  try {
    const response = await fetch('http://localhost:5000/api/usuario', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const userData = await response.json();
    if (email !== userData.email) {
      const emailCheckResponse = await fetch('http://localhost:5000/api/verificar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const emailCheckData = await emailCheckResponse.json();
      if (!emailCheckResponse.ok || emailCheckData.existe) {
        return Swal.fire({
          title: 'Erro',
          text: 'Este e-mail já está cadastrado!',
          icon: 'error',
          background: '#fff',
          color: '#000',
        });
      }
    }
  } catch (error: any) {
    return Swal.fire({
      title: 'Erro',
      text: 'Erro ao verificar o e-mail!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação de telefone
  const telefoneRegex = /^\(\d{2}\) \d \d{4}-\d{4}$/;
  if (!telefoneRegex.test(telefone)) {
    return Swal.fire({
      title: 'Erro',
      text: 'Digite um telefone válido no formato (00) 0 0000-0000!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação de senha (se modificada): mínimo 8 caracteres, número e caractere especial
  if (senha.trim()) {
    const senhaForte = senha.length >= 8 && /\d/.test(senha) && /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    if (!senhaForte) {
      return Swal.fire({
        title: 'Erro',
        text: 'A senha deve atender os 3 critérios: mínimo 8 caracteres, conter número e caractere especial!',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
    }
  }

  const telefoneSemFormatacao = telefone.replace(/\D/g, '');

  try {
    const response = await fetch('http://localhost:5000/api/usuario', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, email, telefone: telefoneSemFormatacao, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar os dados!');
    }

    localStorage.setItem('nomeUsuario', nome);

    Swal.fire({
      title: 'Sucesso!',
      text: 'Dados atualizados com sucesso!',
      icon: 'success',
      background: '#fff',
      color: '#000',
    });
    navigate('/'); // Redirecionar para a página inicial
  } catch (error: any) {
    Swal.fire({
      title: 'Erro',
      text: error.message,
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }
};

// Bloquear CPF para edição
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { id, value } = e.target;

  if (id === 'cpf') {
    return; // CPF não pode ser editado
  }

  setForm((prevForm) => {
    if (id === 'telefone') {
      const x = value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})/);
      const telefoneFormatado = x
        ? !x[2]
          ? x[1]
          : `(${x[1]}) ${x[2]}${x[3] ? ` ${x[3]}${x[4] ? `-${x[4]}` : ''}` : ''}`
        : value;

      return {
        ...prevForm,
        telefone: telefoneFormatado,
      };
    }

    return {
      ...prevForm,
      [id]: value,
    };
  });
};

const handleDeleteAccount = async () => {
  const token = localStorage.getItem('token');
  localStorage.removeItem('nomeUsuario');
  localStorage.removeItem('papelUsuario');

  const result = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não pode ser desfeita. Sua conta será excluída permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    background: '#fff',
    color: '#000',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch('http://localhost:5000/api/usuario', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir a conta!');
      }

      localStorage.removeItem('nomeUsuario');
      localStorage.removeItem('token');

      Swal.fire({
        title: 'Conta excluída!',
        text: 'Sua conta foi excluída com sucesso.',
        icon: 'success',
        background: '#fff',
        color: '#000',
      });

      navigate('/'); // Redirecionar para a página inicial
    } catch (error: any) {
      Swal.fire({
        title: 'Erro',
        text: error.message,
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
    }
  }
};


  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-hero">
          <div className="hero-content">
            <h2>Editar Conta</h2>
            <p>Atualize suas informações pessoais abaixo.</p>
          </div>
        </div>

        <div className="register-container">
          <div className="register-form-container">
            <h1>Editar Conta</h1>
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input type="text" id="nome" value={form.nome} onChange={handleChange} placeholder="Digite seu nome completo" />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" value={form.email} onChange={handleChange} placeholder="Digite seu e-mail" />
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 0 0000-0000" />
              </div>
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  value={form.cpf}
                  readOnly // Bloqueia a edição do CPF
                  placeholder="Digite seu CPF"
                />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" value={form.senha} onChange={handleChange} placeholder="Digite uma nova senha (opcional)" />
              </div>
              <button type="submit" className="register-btn">Salvar Alterações</button>
              <div className="form-group">
                <button type="button" className="delete-btn" onClick={handleDeleteAccount}>
                    Excluir Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}