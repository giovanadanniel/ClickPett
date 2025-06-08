import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './style.css';

const ClickPetLogin: React.FC = () => {
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
            <form className="login-form">
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" placeholder="Digite seu e-mail" required />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" placeholder="Digite sua senha" required />
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
