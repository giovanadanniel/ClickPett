import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar o useNavigate
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import './style.css';

export default function CadastroServico() {
  const [form, setForm] = useState({
    nomeServico: '',
    precoServico: '',
  });
  const navigate = useNavigate(); // Inicializar o useNavigate

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { nomeServico, precoServico } = form;

    // Validação do nome do serviço
    if (nomeServico.trim().length < 3) {
      return Swal.fire({
        title: 'Erro',
        text: 'O nome do serviço deve ter no mínimo 3 caracteres.',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
    }

    // Validação do preço
    const preco = parseFloat(precoServico);
    if (isNaN(preco) || preco <= 0 || !/^\d+(\.\d{1,2})?$/.test(precoServico)) {
      return Swal.fire({
        title: 'Erro',
        text: 'O preço deve ser maior que 0 e pode ter no máximo 2 casas decimais.',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
    }

    const token = localStorage.getItem('token');
    const clienteId = localStorage.getItem('clienteId');

    if (!token || !clienteId) {
      return Swal.fire({
        title: 'Erro',
        text: 'Token ou ID do cliente não encontrado! Faça login novamente.',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
    }

    try {
      const response = await fetch('http://localhost:5000/api/cadastrar-servico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nomeServico, precoServico: preco, clienteId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cadastrar serviço!');
      }

      Swal.fire({
        title: 'Sucesso!',
        text: 'Serviço cadastrado com sucesso!',
        icon: 'success',
        background: '#fff',
        color: '#000',
      });

      navigate('/meus-servicos'); // Redirecionar para a página Meus Serviços
    } catch (error: any) {
      Swal.fire({
        title: 'Erro',
        text: error.message,
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
    }
  };

  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-container">
          <div className="register-form-container">
            <h1>Cadastrar Serviço</h1>
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nomeServico">Nome do Serviço</label>
                <input
                  type="text"
                  id="nomeServico"
                  value={form.nomeServico}
                  onChange={handleChange}
                  placeholder="Digite o nome do serviço"
                />
              </div>
              <div className="form-group">
                <label htmlFor="precoServico">Preço do Serviço</label>
                <input
                  type="number"
                  id="precoServico"
                  value={form.precoServico}
                  onChange={handleChange}
                  placeholder="Digite o preço do serviço"
                  min="0"
                  step="0.01"
                />
              </div>
              <button type="submit" className="register-btn">
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}