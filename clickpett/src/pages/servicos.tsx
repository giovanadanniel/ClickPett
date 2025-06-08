import React from "react";
import { Link } from "react-router-dom";
import './style.css';

const Servicos = () => {
  return (
    <div>
      <header className="header-container">
        <img src="images/logoSemFundo.png" alt="ClickPet Logo" className="logo" />
        <div className="search-container">
          <form className="search-bar">
            <input type="text" placeholder="O que seu pet precisa?" />
            <button type="submit">🔍</button>
          </form>
        </div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li> 
            <li><Link to="/sobre">Sobre</Link></li> 
            <li><Link to="/servicos">Serviços</Link></li> 
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </nav>
         <Link to="/login" className="login-btn">Login</Link>
      </header>

      <main className="servicos-container">
        <h1 className="title">Nossos Serviços</h1>

        {/* Serviço 1 - Banho */}
        <div className="servico">
          <div className="servico-imagem" style={{ backgroundImage: "url('images/cachorro.png')" }}></div>
          <div className="servico-conteudo">
            <h2>Banho Completo</h2>
            <p>No banho oferecemos um tratamento completo para seu pet, utilizando produtos hipoalergênicos de alta qualidade. Nosso processo inclui:</p>
            <ul>
              <li>Pré-lavagem com escovação</li>
              <li>Banho com shampoo específico para o tipo de pelagem</li>
              <li>Hidratação com condicionador</li>
              <li>Secagem com toalhas macias e secador em temperatura adequada</li>
              <li>Limpeza de ouvidos e corte de unhas</li>
            </ul>
            <p>Deixe seu pet limpo, cheiroso e feliz com nosso serviço especializado!</p>
             <a href="/reserva" className="btn-reserva">Agendar</a>
          </div>
        </div>

        {/* Serviço 2 - Tosa */}
        <div className="servico">
          <div className="servico-imagem" style={{ backgroundImage: "url('images/cachorroTosa.png')" }}></div>
          <div className="servico-conteudo">
            <h2>Tosa Higiênica</h2>
            <p>Tosa higiênica profissional para seu pet, realizada por especialistas em cuidados com pelagem animal.</p>
            <ul>
              <li>Tosa na região genital para maior higiene</li>
              <li>Aparação das patinhas</li>
              <li>Limpeza da região anal</li>
              <li>Ajuste de pelos faciais</li>
              <li>Opção de tosa completa ou modelada</li>
            </ul>
            <p>Mantenha seu pet confortável durante todo o ano!</p>
             <a href="/reserva" className="btn-reserva">Agendar</a>
          </div>
        </div>

        {/* Serviço 3 - Veterinário */}
        <div className="servico">
          <div className="servico-imagem" style={{ backgroundImage: "url('images/cachorroConsulta.png')" }}></div>
          <div className="servico-conteudo">
            <h2>Consulta Veterinária</h2>
            <p>Serviço completo de saúde animal com profissionais qualificados.</p>
            <ul>
              <li>Consultas de rotina e check-ups</li>
              <li>Vacinação e vermifugação</li>
              <li>Exames laboratoriais</li>
              <li>Atendimento emergencial</li>
              <li>Acompanhamento pós-operatório</li>
            </ul>
            <p>Cuide da saúde do seu companheiro com nossos especialistas!</p>
             <a href="/reserva" className="btn-reserva">Agendar</a>
          </div>
        </div>
      </main>

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
    </div>
  );
};

export default Servicos;