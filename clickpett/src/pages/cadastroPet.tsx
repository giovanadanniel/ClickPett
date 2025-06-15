import React, { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar o hook useNavigate
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import './style.css';

export default function CadastrarPet() {
  const navigate = useNavigate(); // Inicializar o hook useNavigate

  useEffect(() => {
    document.title = 'Cadastrar Pet - Click Pet';

    const token = localStorage.getItem('token');
    const papelUsuario = localStorage.getItem('papelUsuario');

    if (!token || papelUsuario !== '1') {
      navigate('/');
    }
  }, [navigate]);

  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    peso: '',
    raca: '', // Novo campo
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  const { nome, dataNascimento, peso, raca } = form;

  // Validação dos campos
  if (!nome.trim() || nome.trim().length < 3) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Nome deve ter no mínimo 3 letras!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação: Nome não pode exceder 50 caracteres
  if (nome.trim().length > 50) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Nome não pode exceder 50 caracteres!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  if (!dataNascimento.trim()) {
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
  const anoAtual = hoje.getFullYear();

  if (diffTime < 0) {
    return Swal.fire({
      title: 'Erro',
      text: 'A data de nascimento não pode ser no futuro!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação: Ano entre 2000 e o ano atual
  if (nascimento.getFullYear() < 2000 || nascimento.getFullYear() > anoAtual) {
    return Swal.fire({
      title: 'Erro',
      text: `O ano da data de nascimento deve estar entre 2000 e ${anoAtual}!`,
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  if (!peso.trim() || isNaN(Number(peso)) || Number(peso) < 0 || !/^\d+(\.\d{1,3})?$/.test(peso.replace(',', '.'))) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Peso deve ser um número válido, não pode ser negativo e deve ter no máximo 3 casas decimais!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  if (!raca.trim() || raca.trim().length < 3) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Raça deve ter no mínimo 3 letras!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação: Raça não pode exceder 50 caracteres
  if (raca.trim().length > 50) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Raça não pode exceder 50 caracteres!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  try {
    const token = localStorage.getItem('token');

    const pesoFormatado = peso.replace(',', '.');

    const response = await fetch('http://localhost:5000/api/cadastrar-pet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, dataNascimento, peso: parseFloat(pesoFormatado), raca }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao cadastrar pet!');
    }

    Swal.fire({
      title: 'Sucesso!',
      text: 'Pet cadastrado com sucesso!',
      icon: 'success',
      background: '#fff',
      color: '#000',
    });
    setForm({ nome: '', dataNascimento: '', peso: '', raca: '' });

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
            <h1>Cadastrar Pet</h1>
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
                
              <button type="submit" className="register-btn">Cadastrar</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}