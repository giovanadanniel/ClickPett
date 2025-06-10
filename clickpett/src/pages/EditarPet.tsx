import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import './style.css';

const EditarPet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ nome: '', dataNascimento: '', peso: '', raca: '' });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Editar Pet - Click Pet';
  }, []);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }

  fetch(`http://localhost:5000/api/pet/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Converter a data de nascimento para o formato DD/MM/YYYY
      const dataNascimentoFormatada = new Date(data.dataNascimento)
        .toISOString()
        .split('T')[0]; // Mantém o formato YYYY-MM-DD para o campo de data

      setForm({
        nome: data.nome,
        dataNascimento: dataNascimentoFormatada, // Formato ajustado para o campo de data
        peso: data.peso,
        raca: data.raca,
      });
    })
    .catch((error) => console.error('Erro ao buscar informações do pet:', error));
}, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const { nome, dataNascimento, peso, raca } = form;

  // Validação do campo Nome
  if (!nome || !nome.trim() || nome.trim().length < 3) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Nome deve ter no mínimo 3 letras!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação do campo Data de Nascimento
  if (!dataNascimento || !dataNascimento.trim()) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Data de Nascimento é obrigatório!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  const diffTime = hoje.getTime() - nascimento.getTime();

  if (diffTime < 0) {
    return Swal.fire({
      title: 'Erro',
      text: 'A data de nascimento não pode ser no futuro!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  const diffDays = diffTime / (1000 * 3600 * 24);

  let idade;
  if (diffDays < 30) {
    idade = `${Math.floor(diffDays)} dias`; // Menos de 1 mês, calcula em dias
  } else if (diffDays < 365) {
    idade = `${Math.floor(diffDays / 30)} meses`; // Menos de 1 ano, calcula em meses
  } else {
    idade = `${Math.floor(diffDays / 365)} anos`; // 1 ano ou mais, calcula em anos
  }

  // Validação do campo Peso
  if (!peso || typeof peso !== 'string' || !peso.trim() || isNaN(Number(peso)) || Number(peso) < 0 || !/^\d+(\.\d{1,3})?$/.test(peso.replace(',', '.'))) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Peso deve ser um número válido, não pode ser negativo e deve ter no máximo 3 casas decimais!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação do campo Raça
  if (!raca || !raca.trim() || raca.trim().length < 3) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Raça deve ter no mínimo 3 letras!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  try {
    const token = localStorage.getItem('token');

    const pesoFormatado = peso.replace(',', '.');

    const response = await fetch(`http://localhost:5000/api/pet/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, dataNascimento, idade, peso: parseFloat(pesoFormatado), raca }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar pet!');
    }

    Swal.fire({
      title: 'Sucesso!',
      text: 'Pet atualizado com sucesso!',
      icon: 'success',
      background: '#fff',
      color: '#000',
    });
    navigate('/meus-pets');
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
            <h1>Editar Pet</h1>
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome do Pet</label>
                <input type="text" id="nome" value={form.nome} onChange={handleChange} placeholder="Digite o nome do pet" />
              </div>
              <div className="form-group">
                <label htmlFor="dataNascimento">Data de Nascimento</label>
                <input
                  type="date"
                  id="dataNascimento"
                  value={form.dataNascimento}
                  onChange={handleChange}
                  placeholder="Digite a data de nascimento do pet"
                />
              </div>
              <div className="form-group">
                <label htmlFor="peso">Peso (kg)</label>
                <input type="number" id="peso" value={form.peso} onChange={handleChange} placeholder="Digite o peso do pet" />
              </div>
              <div className="form-group">
                <label htmlFor="raca">Raça</label>
                <input type="text" id="raca" value={form.raca} onChange={handleChange} placeholder="Digite a raça do pet" />
              </div>
              <button type="submit" className="register-btn">Salvar</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditarPet;