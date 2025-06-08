import React from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from "react-router-dom";
import "./style.css";

function ContatoPage() {
  return (
    <>
      <head>
        <title>Contato - ClickPet</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="images/logoCachorroSemFundo.png"
        />
      </head>

      <Header /> {/* Usa o componente Header */}

      <main className="contato-container">
        <h1 className="title">Entre em Contato</h1>

        <div className="contato-content">
          <div className="info-contato">
            <h2>Informações de Contato</h2>

            <div className="contato-item">
              <i>📍</i>
              <div className="contato-text">
                <h3>Endereço</h3>
                <p>Rua dos Animais, 123 - Bairro Pet<br />Curitiba - PR, 80000-000</p>
              </div>
            </div>

            <div className="contato-item">
              <i>📞</i>
              <div className="contato-text">
                <h3>Telefone</h3>
                <p>(41) 9999-9999<br />(41) 8888-8888 (WhatsApp)</p>
              </div>
            </div>

            <div className="contato-item">
              <i>✉️</i>
              <div className="contato-text">
                <h3>Email</h3>
                <p>contato@clickpet.com.br<br />sac@clickpet.com.br</p>
              </div>
            </div>

            <div className="contato-item">
              <i>⏰</i>
              <div className="contato-text">
                <h3>Horário de Funcionamento</h3>
                <p>Segunda a Sexta: 8h às 18h<br />Sábado: 9h às 13h<br />Domingo: Fechado</p>
              </div>
            </div>
          </div>

          <div className="mapa">
            <iframe
              title="Mapa ClickPet"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.073392715155!2d-49.2695201!3d-25.4288547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce4135a3a9345%3A0xbbb86cb5be4b4b3b!2sMaph%20Hotel!5e0!3m2!1spt-BR!2sbr!4v1712164549103!5m2!1spt-BR!2sbr"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>

      <Footer /> {/* Usa o componente Footer */}
      
    </>
  );
}

export default ContatoPage;
