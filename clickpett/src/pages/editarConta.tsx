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
          cpf: formatarCPF(data.cpf),
          senha: '', // Não exibir a senha
        });
      } catch (error: any) {
        Swal.fire({ title: 'Erro', text: error.message, icon: 'error', background: '#121212', color: '#fff' });
      }
    };

    fetchUserData();
  }, [token]);

  // Função para formatar telefone
  const formatarTelefone = (telefone: string) => {
    return telefone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  };

  // Função para formatar CPF
  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

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

      if (id === 'cpf') {
        const formattedCPF = value.replace(/\D/g, '').replace(
          /(\d{3})(\d{3})(\d{3})(\d{0,2})/,
          (match, p1, p2, p3, p4) =>
            p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`
        );
        return {
          ...prevForm,
          cpf: formattedCPF,
        };
      }

      return {
        ...prevForm,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { nome, email, telefone, cpf, senha } = form;

    if (!nome.trim()) return Swal.fire({ title: 'Erro', text: 'O campo Nome é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });
    if (!telefone.trim()) return Swal.fire({ title: 'Erro', text: 'O campo Telefone é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });
    if (!cpf.trim()) return Swal.fire({ title: 'Erro', text: 'O campo CPF é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return Swal.fire({ title: 'Erro', text: 'Digite um email válido!', icon: 'error', background: '#121212', color: '#fff' });

    const telefoneSemFormatacao = telefone.replace(/\D/g, '');
    const cpfSemFormatacao = cpf.replace(/\D/g, '');

    try {
        const response = await fetch('http://localhost:5000/api/usuario', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email, telefone: telefoneSemFormatacao, cpf: cpfSemFormatacao, senha }),
        });

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar os dados!');
        }

        // Atualizar o nome no localStorage
        localStorage.setItem('nomeUsuario', nome);

        Swal.fire({ title: 'Sucesso!', text: 'Dados atualizados com sucesso!', icon: 'success', background: '#121212', color: '#fff' });
        navigate('/'); // Redirecionar para a página inicial
    } catch (error: any) {
        Swal.fire({ title: 'Erro', text: error.message, icon: 'error', background: '#121212', color: '#fff' });
    }
    };

const handleDeleteAccount = async () => {
  const token = localStorage.getItem('token'); // Recuperar o token do usuário logado

  // Exibir confirmação antes de excluir a conta
  const result = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não pode ser desfeita. Sua conta será excluída permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    background: '#121212',
    color: '#fff',
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

      // Remover dados do localStorage e redirecionar para a página inicial
      localStorage.removeItem('nomeUsuario');
      localStorage.removeItem('token');

      Swal.fire({
        title: 'Conta excluída!',
        text: 'Sua conta foi excluída com sucesso.',
        icon: 'success',
        background: '#121212',
        color: '#fff',
      });

      navigate('/'); // Redirecionar para a página inicial
    } catch (error: any) {
      Swal.fire({
        title: 'Erro',
        text: error.message,
        icon: 'error',
        background: '#121212',
        color: '#fff',
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
                <input type="text" id="cpf" value={form.cpf} onChange={handleChange} placeholder="Digite seu CPF" />
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