import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const ClickPetHome: React.FC = () => {
  const destaquesRef = useRef<HTMLDivElement>(null);
  const depoimentosRef = useRef<HTMLDivElement>(null);

  const carrosseis: any = {};

  const updateCarrosselPosition = (carrosselId: keyof typeof carrosseis, animate = true) => {
    const carrossel = carrosseis[carrosselId];
    const totalRealSlides = carrossel.slides.length - (2 * carrossel.slidesPerMove);

    if (carrossel.currentIndex < carrossel.slidesPerMove) {
      setTimeout(() => {
        carrossel.element.style.transition = 'none';
        carrossel.currentIndex = totalRealSlides + carrossel.currentIndex;
        updateCarrosselPosition(carrosselId, false);
      }, 500);
    } else if (carrossel.currentIndex >= carrossel.slides.length - carrossel.slidesPerMove) {
      setTimeout(() => {
        carrossel.element.style.transition = 'none';
        carrossel.currentIndex = carrossel.currentIndex - totalRealSlides;
        updateCarrosselPosition(carrosselId, false);
      }, 500);
    }

    carrossel.element.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    const transformValue = -carrossel.currentIndex * (100 / carrossel.slidesPerMove);
    carrossel.element.style.transform = `translateX(${transformValue}%)`;
  };

  const moveCarrossel = (carrosselId: keyof typeof carrosseis, direction: number) => {
    const carrossel = carrosseis[carrosselId];
    if (!carrossel || !carrossel.element || !carrossel.slides.length) return;

    carrossel.currentIndex += direction * carrossel.slidesPerMove;
    updateCarrosselPosition(carrosselId);
  };

  useEffect(() => {
    if (!destaquesRef.current || !depoimentosRef.current) return;

    carrosseis['destaquesCarrossel'] = {
      element: destaquesRef.current,
      slides: Array.from(destaquesRef.current.querySelectorAll('.carrossel-item')),
      currentIndex: 0,
      autoRotate: true,
      interval: 5000,
      slidesPerMove: 1,
    };

    carrosseis['depoimentosCarrossel'] = {
      element: depoimentosRef.current,
      slides: Array.from(depoimentosRef.current.querySelectorAll('.carrossel-item')),
      currentIndex: 0,
      autoRotate: true,
      interval: 6000,
      slidesPerMove: 1,
    };

    const prepareInfiniteCarrossel = (carrosselId: keyof typeof carrosseis) => {
      const carrossel = carrosseis[carrosselId];
      const slides = carrossel.slides;

      for (let i = 0; i < carrossel.slidesPerMove; i++) {
        const clone = slides[i].cloneNode(true) as HTMLElement;
        carrossel.element.appendChild(clone);
      }

      for (let i = slides.length - 1; i >= slides.length - carrossel.slidesPerMove; i--) {
        const clone = slides[i].cloneNode(true) as HTMLElement;
        carrossel.element.insertBefore(clone, slides[0]);
      }

      carrossel.slides = Array.from(carrossel.element.querySelectorAll('.carrossel-item'));
      carrossel.currentIndex = carrossel.slidesPerMove;
      updateCarrosselPosition(carrosselId, false);
    };

    const startAutoRotation = (carrosselId: keyof typeof carrosseis) => {
      const carrossel = carrosseis[carrosselId];
      carrossel.intervalId = window.setInterval(() => {
        moveCarrossel(carrosselId, 1);
      }, carrossel.interval);
    };

    const stopAutoRotation = (carrosselId: keyof typeof carrosseis) => {
      const carrossel = carrosseis[carrosselId];
      if (carrossel.intervalId) clearInterval(carrossel.intervalId);
    };

    prepareInfiniteCarrossel('destaquesCarrossel');
    prepareInfiniteCarrossel('depoimentosCarrossel');
    startAutoRotation('destaquesCarrossel');
    startAutoRotation('depoimentosCarrossel');

    const containers = document.querySelectorAll('.carrossel-container');
    containers.forEach(container => {
      const id = container.querySelector('.carrossel')!.id as keyof typeof carrosseis;
      container.addEventListener('mouseenter', () => stopAutoRotation(id));
      container.addEventListener('mouseleave', () => startAutoRotation(id));
    });

    return () => {
      stopAutoRotation('destaquesCarrossel');
      stopAutoRotation('depoimentosCarrossel');
    };
  }, []);

  return (
    <div className="page">
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

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Seu pet merece o melhor cuidado</h1>
            <p>Na ClickPet, oferecemos serviços premium para garantir o bem-estar e felicidade do seu companheiro de quatro patas.</p>
            <a href="/servicos" className="btn-hero">Conheça nossos serviços</a>
          </div>
        </section>

        <section className="destaques">
          <div className="destaques-container">
            <h2>Por que escolher a ClickPet?</h2>
            <div className="carrossel-container">
              <button className="carrossel-btn prev" onClick={() => moveCarrossel('destaquesCarrossel', -1)}>❮</button>
              <div className="carrossel" id="destaquesCarrossel" ref={destaquesRef}>
                <div className="carrossel-item">
                  <div className="destaques-grid">
                    <div className="destaque-card">
                      <div className="destaque-img" style={{ backgroundImage: "url('images/petProfissionais.jpg')" }}></div>
                      <div className="destaque-content">
                        <h3>Profissionais Qualificados</h3>
                        <p>Nossa equipe é composta por especialistas apaixonados por animais e altamente treinados.</p>
                      </div>
                    </div>
                    <div className="destaque-card">
                      <div className="destaque-img" style={{ backgroundImage: "url('pet-produtos.jpg')" }}></div>
                      <div className="destaque-content">
                        <h3>Produtos Premium</h3>
                        <p>Utilizamos apenas produtos de alta qualidade, hipoalergênicos e testados dermatologicamente.</p>
                      </div>
                    </div>
                    <div className="destaque-card">
                      <div className="destaque-img" style={{ backgroundImage: "url('pet-ambiente.jpg')" }}></div>
                      <div className="destaque-content">
                        <h3>Ambiente Acolhedor</h3>
                        <p>Espaço projetado para o conforto e segurança dos pets, reduzindo o estresse durante os procedimentos.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carrossel-item">
                  <div className="destaques-grid">
                    <div className="destaque-card">
                      <div className="destaque-img" style={{ backgroundImage: "url('images/clinicaAmbiente.jpg')" }}></div>
                      <div className="destaque-content">
                        <h3>Higiene Impecável</h3>
                        <p>Nossos espaços são limpos e desinfetados constantemente, garantindo a saúde de todos os pets.</p>
                      </div>
                    </div>
                    <div className="destaque-card">
                      <div className="destaque-img" style={{ backgroundImage: "url('images/ambienteEntrada.webp')" }}></div>
                      <div className="destaque-content">
                        <h3>Atendimento Personalizado</h3>
                        <p>Cada pet recebe atenção individualizada de acordo com suas necessidades específicas.</p>
                      </div>
                    </div>
                    <div className="destaque-card">
                      <div className="destaque-img" style={{ backgroundImage: "url('images/fachadaPredio.webp')" }}></div>
                      <div className="destaque-content">
                        <h3>Localização Privilegiada</h3>
                        <p>Facilidade de acesso e estacionamento amplo para sua comodidade.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="carrossel-btn next" onClick={() => moveCarrossel('destaquesCarrossel', 1)}>❯</button>
            </div>
          </div>
        </section>

        <section className="servicos-home">
          <div className="servicos-container">
            <h2>Nossos Serviços</h2>
            <div className="destaques-grid">
              <div className="destaque-card">
                <div className="destaque-img" style={{ backgroundImage: "url('banho-pet.jpg')" }}></div>
                <div className="destaque-content">
                  <h3>Banho Completo</h3>
                  <p>Hidratação, limpeza de ouvidos e corte de unhas com produtos de alta qualidade.</p>
                  <a href="/reserva" className="btn-reserva">Agendar</a>
                </div>
              </div>
              <div className="destaque-card">
                <div className="destaque-img" style={{ backgroundImage: "url('tosa-pet.jpg')" }}></div>
                <div className="destaque-content">
                  <h3>Tosa Higiênica</h3>
                  <p>Tosa profissional realizada por especialistas em cuidados com pelagem animal.</p>
                   <a href="/reserva" className="btn-reserva">Agendar</a>
                </div>
              </div>
              <div className="destaque-card">
                <div className="destaque-img" style={{ backgroundImage: "url('vet-pet.jpg')" }}></div>
                <div className="destaque-content">
                  <h3>Consulta Veterinária</h3>
                  <p>Atendimento especializado com profissionais qualificados para cuidar da saúde do seu pet.</p>
                   <a href="/reserva" className="btn-reserva">Agendar</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="depoimentos">
          <div className="depoimentos-container">
            <h2>O que dizem sobre nós</h2>
            <div className="carrossel-container">
              <button className="carrossel-btn prev" onClick={() => moveCarrossel('depoimentosCarrossel', -1)}>❮</button>
              <div className="carrossel" id="depoimentosCarrossel" ref={depoimentosRef}>
                <div className="carrossel-item">
                  <div className="depoimentos-grid">
                    <div className="depoimento-card">
                      <div className="depoimento-text">
                        "Meu cachorro adora vir para a ClickPet! Os profissionais são incríveis e ele sempre volta feliz e cheiroso."
                      </div>
                      <div className="depoimento-autor">- Ana Carolina</div>
                    </div>
                    <div className="depoimento-card">
                      <div className="depoimento-text">
                        "Finalmente encontrei um lugar que trata meu gato com o carinho e cuidado que ele merece. Recomendo a todos!"
                      </div>
                      <div className="depoimento-autor">- Ricardo Almeida</div>
                    </div>
                  </div>
                </div>
                <div className="carrossel-item">
                  <div className="depoimentos-grid">
                    <div className="depoimento-card">
                      <div className="depoimento-text">
                        "Ótimo atendimento e profissionais qualificados. Meu bulldog francês sempre é bem cuidado e volta super feliz."
                      </div>
                      <div className="depoimento-autor">- Fernanda Souza</div>
                    </div>
                    <div className="depoimento-card">
                      <div className="depoimento-text">
                        "A ClickPet salvou meu pet em uma emergência. Atendimento rápido e eficiente. Sou cliente fiel!"
                      </div>
                      <div className="depoimento-autor">- Carlos Eduardo</div>
                    </div>
                  </div>
                </div>
                <div className="carrossel-item">
                  <div className="depoimentos-grid">
                    <div className="depoimento-card">
                      <div className="depoimento-text">
                        "Adoro o cuidado com os detalhes. Meu pet tem alergia e eles sempre usam produtos específicos para ele."
                      </div>
                      <div className="depoimento-autor">- Juliana Martins</div>
                    </div>
                    <div className="depoimento-card">
                      <div className="depoimento-text">
                        "O hotel para pets é maravilhoso! Quando viajo, sei que meu dog está em boas mãos."
                      </div>
                      <div className="depoimento-autor">- Roberto Silva</div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="carrossel-btn next" onClick={() => moveCarrossel('depoimentosCarrossel', 1)}>❯</button>
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
    </div>
  );
};

export default ClickPetHome;
