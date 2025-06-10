import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/style.css';

const Header: React.FC = () => {
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const [papelUsuario, setPapelUsuario] = useState<number | null>(null); // Estado para armazenar o papel do usuário
  const [menuAberto, setMenuAberto] = useState(false); // Estado para controlar o menu

  useEffect(() => {
    // Recuperar o nome e papel do usuário do localStorage
    const nome = localStorage.getItem('nomeUsuario');
    const papel = localStorage.getItem('papelUsuario'); // Recupera o papel do usuário
    setNomeUsuario(nome);
    setPapelUsuario(papel ? parseInt(papel, 10) : null);

    // Adicionar um listener para mudanças no localStorage
    const handleStorageChange = () => {
      const updatedNome = localStorage.getItem('nomeUsuario');
      const updatedPapel = localStorage.getItem('papelUsuario');
      setNomeUsuario(updatedNome);
      setPapelUsuario(updatedPapel ? parseInt(updatedPapel, 10) : null);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Remover o nome e papel do usuário do localStorage
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('papelUsuario');
    localStorage.removeItem('token'); // Remover o token também
    setNomeUsuario(null); // Atualizar o estado para refletir o logout
    setPapelUsuario(null);
    window.location.reload(); // Recarregar a página para atualizar o estado
  };

  const toggleMenu = () => {
    setMenuAberto(!menuAberto); // Alternar a visibilidade do menu
  };

  return (
    <header>
      <div className="header-container">
        <img src="/images/logoSemFundo.png" alt="ClickPet Logo" className="logo" />
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
            <div className="dropdown">
              <button className="login-btn" onClick={toggleMenu}>
                Olá, {nomeUsuario}
              </button>
              {menuAberto && (
                <div className="dropdown-menu">
                  {papelUsuario === 1 && (
                    <>
                      <Link to="/editar-conta" className="dropdown-item">Editar Usuário</Link>
                      <Link to="/cadastrar-pet" className="dropdown-item">Cadastrar Pet</Link>
                      <Link to="/meus-pets" className="dropdown-item">Meus Pets</Link>
                      <Link to="/meus-agendamentos" className="dropdown-item">Meus Agendamentos</Link> {/* Novo link */}
                    </>
                  )}
                  {papelUsuario === 2 && (
                    <>
                      <Link to="/editar-conta" className="dropdown-item">Editar Usuário</Link>
                      <Link to="/cadastrar-servico" className="dropdown-item">Cadastrar Serviço</Link>
                      <Link to="/meus-servicos" className="dropdown-item">Meus Serviços</Link> {/* Adicionado */}
                    </>
                  )}
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>Sair</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;