import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link } from "react-router-dom";
import './style.css';

const ReservaServico = () => {
  const [formData, setFormData] = useState({
    servico: '',
    petNome: '',
    data: '',
    hora: '',
    observacoes: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const servicoParam = params.get('servico');
    if (servicoParam) {
      setFormData((prev) => ({ ...prev, servico: servicoParam }));
    }
  }, []);

  // Adicione o tipo ChangeEvent para eventos de input/select
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Adicione o tipo FormEvent para eventos de formulário
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Reserva enviada:', formData);
    // Aqui você pode adicionar a lógica de envio para uma API, se quiser.
  };


  return (
    <>
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

      <main className="reserva-container">
        <h1 className="title">Reserve um Serviço</h1>
        <form className="reserva-form" onSubmit={handleSubmit}>
          <label htmlFor="servico">Escolha o serviço:</label>
          <select
            id="servico"
            name="servico"
            required
            value={formData.servico}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            <option value="banho">Banho Completo</option>
            <option value="tosa">Tosa Higiênica</option>
            <option value="veterinario">Consulta Veterinária</option>
          </select>

          <label htmlFor="petNome">Nome do Pet:</label>
          <input
            type="text"
            id="petNome"
            name="petNome"
            required
            placeholder="Ex: Rex"
            value={formData.petNome}
            onChange={handleChange}
          />

          <label htmlFor="data">Data do Agendamento:</label>
          <input
            type="date"
            id="data"
            name="data"
            required
            value={formData.data}
            onChange={handleChange}
          />

          <label htmlFor="hora">Horário:</label>
          <input
            type="time"
            id="hora"
            name="hora"
            required
            value={formData.hora}
            onChange={handleChange}
          />

          <label htmlFor="observacoes">Observações:</label>
          <textarea
            id="observacoes"
            name="observacoes"
            rows={3}
            placeholder="Ex: Pet agressivo, alergias, etc."
            value={formData.observacoes}
            onChange={handleChange}
          />

          <button type="submit" className="btn-reserva">Confirmar Reserva</button>
        </form>
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

export default ReservaServico;
