import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const ClickPetLogin: React.FC = () => {
  return (
    <>
      <header>
        <div className="header-container">
          <img src="images/logoSemFundo.png" alt="ClickPet Logo" className="logo" />
          <div className="search-container"></div>
          <form className="search-bar">
            <input type="text" placeholder="O que seu pet precisa?" />
            <button type="submit">🔍</button>
          </form>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/sobre">Sobre</Link></li>
              <li><Link to="/servicos">Serviços</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </nav>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </header>

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

      <footer style={{ marginTop: 0 }}>
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">ClickPet</div>
            <p>Cuidando do seu pet com amor e dedicação desde 2025.</p>
          </div>

          <div className="footer-section">
            <h3>Links Rápidos</h3>
            <ul>
                <li><Link to="/sobre">Sobre Nós</Link></li>
                <li><Link to="/servicos">Nossos Serviços</Link></li>
                <li><Link to="/faq">Perguntas Frequentes</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contato</h3>
            <ul>
              <li>📞 (99) 99999-9999</li>
              <li>✉️ contato@clickpet.com.br</li>
              <li>📍 Curitiba, Brasil</li>
            </ul>
          </div>
        </div>

        <div className="copyright">
          &copy; 2023 ClickPet. Todos os direitos reservados.
        </div>
      </footer>
    </>
  );
};

export default ClickPetLogin;
