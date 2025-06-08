import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/style.css'; 

const Footer: React.FC = () => {
  return (
    <footer>
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
  );
};

export default Footer;