import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
    document.title = 'Reserva - Click Pet';
  }, []);

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
      
      <Header /> {/* Usa o componente Header */}

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

      <Footer /> {/* Usa o componente Footer */}
      
    </>
  );
};

export default ReservaServico;
