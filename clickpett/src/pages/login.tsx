import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './style.css';

const ClickPetLogin: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    senha: '',
  });
  const [showSenha, setShowSenha] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao fazer login!');
    }

    const data = await response.json();
    console.log('Login bem-sucedido:', data);

    // Armazenar o token JWT e o nome do usuário no localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('nomeUsuario', data.user.nome);

    // Exibir aviso de sucesso com SweetAlert2
    await Swal.fire({
      title: 'Sucesso!',
      text: 'Login realizado com sucesso!',
      icon: 'success',
      confirmButtonText: 'OK',
    });

    // Redirecionar para a página inicial
    navigate('/');
  } catch (error: any) {
    Swal.fire({
      title: 'Erro',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};

const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:5000/api/protected', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Acesso negado!');
  }

  const data = await response.json();
  console.log('Dados protegidos:', data);
};


  return (
    <>
      <Header /> {/* Usa o componente Header */}

      <div className="login-page">
        <div className="login-hero">
          <div className="hero-content">
            <h2>Bem-vindo de volta à ClickPet</h2>
            <p>Acesse sua conta para agendar serviços, acompanhar o histórico do seu pet e muito mais.</p>
          </div>
        </div>

        <div className="login-container">
          <div className="login-form-container">
            <h1>Login</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showSenha ? 'text' : 'password'}
                    id="senha"
                    value={form.senha}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    required
                  />
                  <img
                    src={showSenha ? '/paw-off.svg' : '/paw.svg'}
                    alt={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setShowSenha((v) => !v)}
                    style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', width: 22, height: 22 }}
                  />
                </div>
              </div>
              <button type="submit" className="login-btn-2">Entrar</button>
            </form>

            <div className="login-options">
              <a href="#">Esqueceu sua senha?</a>
              <Link to="/cadastro">Não tem uma conta? Cadastre-se</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer /> {/* Usa o componente Footer */}
    </>
  );
};

export default ClickPetLogin;