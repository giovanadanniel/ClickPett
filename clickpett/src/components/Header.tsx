import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/style.css'; 

const Header: React.FC = () => {
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar o nome do usuário do localStorage
    const nome = localStorage.getItem('nomeUsuario');
    setNomeUsuario(nome);
  }, []);

  const handleLogout = () => {
    // Remover o nome do usuário do localStorage
    localStorage.removeItem('nomeUsuario');
    setNomeUsuario(null); // Atualizar o estado para refletir o logout
    window.location.reload(); // Recarregar a página para atualizar o estado
  };

  return (
    <header>
      <div className="header-container">
        <img src="images/logoSemFundo.png" alt="ClickPet Logo" className="logo" />
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
        <div className="user-actions">
          {nomeUsuario ? (
            <>
              <button className="login-btn">Olá, {nomeUsuario}</button>
              <button className="logout-btn" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;