import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './style.css';

const ClickPetSobre: React.FC = () => {
  return (
    <>
      <Header /> {/* Usa o componente Header */}

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

      <Footer /> {/* Usa o componente Footer */}
      
    </>
  );
};

export default ClickPetSobre;
