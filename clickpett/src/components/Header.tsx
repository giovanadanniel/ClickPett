import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import '../pages/style.css';

const Header: React.FC = () => {
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const [papelUsuario, setPapelUsuario] = useState<number | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    const nome = localStorage.getItem('nomeUsuario');
    const papel = localStorage.getItem('papelUsuario');
    setNomeUsuario(nome);
    setPapelUsuario(papel ? parseInt(papel, 10) : null);

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
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('papelUsuario');
    localStorage.removeItem('token');
    setNomeUsuario(null);
    setPapelUsuario(null);
    navigate('/'); // Redirecionar para a página inicial
  };

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
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
                      <Link to="/meus-agendamentos" className="dropdown-item">Meus Agendamentos</Link>
                    </>
                  )}
                  {papelUsuario === 2 && (
                    <>
                      <Link to="/editar-conta" className="dropdown-item">Editar Usuário</Link>
                      <Link to="/cadastrar-servico" className="dropdown-item">Cadastrar Serviço</Link>
                      <Link to="/meus-servicos" className="dropdown-item">Meus Serviços</Link>
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