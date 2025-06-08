import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const ClickPetSobre: React.FC = () => {
  return (
    <>
      {/* Head equivalente (tags como <title> e <link> ficam no index.html ou com react-helmet) */}
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

      <main>
        <section id="sobre" className="sobre-container">
          <h1 className="title">Sobre a ClickPet</h1>
          <div className="sobre-content">
            <p>
              Bem-vindo à ClickPet, sua plataforma completa para cuidar do seu animal de estimação com amor e dedicação.
              Fundada em 2020, nossa missão é conectar tutores de pets aos melhores serviços e produtos para garantir o
              bem-estar dos seus companheiros.
            </p>

            <p>
              Nossa equipe é formada por amantes de animais e profissionais qualificados que entendem as necessidades
              especiais de cada pet. Acreditamos que todos os animais merecem cuidados de qualidade e estamos aqui para
              facilitar o acesso a esses serviços.
            </p>

            <div className="missao-visao">
              <div className="missao">
                <h3>Nossa Missão</h3>
                <p>
                  Facilitar o acesso a produtos e serviços de qualidade para pets, promovendo seu bem-estar e
                  fortalecendo o vínculo entre animais e seus tutores através de soluções práticas e confiáveis.
                </p>
              </div>
              <div className="visao">
                <h3>Nossa Visão</h3>
                <p>
                  Ser a plataforma líder em soluções para pets na América Latina, reconhecida pela excelência no
                  atendimento, qualidade dos serviços e compromisso com o bem-estar animal.
                </p>
              </div>
            </div>

            <div className="missao-visao">
              <div className="missao">
                <h3>Nossos valores</h3>
                <p>
                  Na ClickPet, nossos valores são o coração de tudo o que fazemos. Guiados pelo amor incondicional pelos
                  animais, acreditamos que cada pet merece cuidado, respeito e uma vida plena ao lado de seus tutores.
                  Nossa busca pela excelência em produtos e serviços é constante, porque sabemos que os animais merecem
                  apenas o melhor. Agimos sempre com transparência e ética, construindo relações de confiança com
                  clientes, parceiros e colaboradores. A inovação está em nosso DNA, mas sempre com propósito:
                  desenvolver soluções que realmente melhorem a vida dos pets e de quem os ama. Assumimos nossa
                  responsabilidade socioambiental, apoiando causas animais e adotando práticas sustentáveis em todas as
                  nossas ações. Celebramos a diversidade, acolhendo todos os pets e seus tutores com igualdade e
                  respeito, porque cada relação especial entre humanos e animais é única. E, acima de tudo, acreditamos
                  no poder da educação continuada, promovendo conhecimento sobre posse responsável e cuidados animais
                  para construir um futuro onde todos os pets sejam felizes e bem cuidados.
                </p>
              </div>
            </div>
          </div>
        </section>
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
    </>
  );
};

export default ClickPetSobre;
