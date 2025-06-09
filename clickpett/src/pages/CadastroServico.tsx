import React, { useState, FormEvent, ChangeEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import './style.css';

export default function CadastroServico() {
  const [form, setForm] = useState({
    nomeServico: '',
    precoServico: '',
  });

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

    const token = localStorage.getItem('token');
    const clienteId = localStorage.getItem('clienteId'); // Recuperar o ID do cliente do localStorage

    if (!token || !clienteId) {
        return Swal.fire({
        title: 'Erro',
        text: 'Token ou ID do cliente não encontrado! Faça login novamente.',
        icon: 'error',
        background: '#121212',
        color: '#fff',
        });
    }

    try {
        const response = await fetch('http://localhost:5000/api/cadastrar-servico', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nomeServico, precoServico: parseFloat(precoServico), clienteId }), // Enviar clienteId
        });

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cadastrar serviço!');
        }

        Swal.fire({
        title: 'Sucesso!',
        text: 'Serviço cadastrado com sucesso!',
        icon: 'success',
        background: '#121212',
        color: '#fff',
        });

        setForm({ nomeServico: '', precoServico: '' });
    } catch (error: any) {
        Swal.fire({
        title: 'Erro',
        text: error.message,
        icon: 'error',
        background: '#121212',
        color: '#fff',
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
                  type="number" // Alterado para aceitar apenas números
                  id="precoServico"
                  value={form.precoServico}
                  onChange={handleChange}
                  placeholder="Digite o preço do serviço"
                  min="0" // Garantir que o valor seja positivo
                  step="0.01" // Permitir valores decimais
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