import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/style.css'; 

const Header: React.FC = () => {
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
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </header>
  );
};

export default Header;