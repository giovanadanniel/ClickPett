import React, { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar o hook useNavigate
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import './style.css';

export default function CadastrarPet() {
  useEffect(() => {
    document.title = 'Cadastrar Pet - Click Pet';
  }, []);

  const [form, setForm] = useState({
    nome: '',
    idade: '',
    peso: '',
    raca: '', // Novo campo
  });

  const navigate = useNavigate(); // Inicializar o hook useNavigate

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { nome, idade, peso, raca } = form;

    // Validação do campo Nome
    if (!nome.trim() || nome.trim().length < 3) {
        return Swal.fire({ 
            title: 'Erro', 
            text: 'O campo Nome deve ter no mínimo 3 letras!', 
            icon: 'error', 
            background: '#fff', 
            color: '#000' 
        });
    }

    // Validação do campo Idade
    if (!idade.trim() || isNaN(Number(idade)) || Number(idade) < 0 || idade.includes('.') || idade.includes(',')) {
        return Swal.fire({ 
            title: 'Erro', 
            text: 'O campo Idade deve ser um número válido e não pode ser negativo ou conter "." ou ","!', 
            icon: 'error', 
            background: '#fff', 
            color: '#000' 
        });
    }

    // Validação do campo Peso
    if (!peso.trim() || isNaN(Number(peso)) || Number(peso) < 0 || !/^\d+(\.\d{1,3})?$/.test(peso.replace(',', '.'))) {
        return Swal.fire({ 
            title: 'Erro', 
            text: 'O campo Peso deve ser um número válido, não pode ser negativo e deve ter no máximo 3 casas decimais!', 
            icon: 'error', 
            background: '#fff', 
            color: '#000' 
        });
    }

    // Validação do campo Raça
    if (!raca.trim() || raca.trim().length < 3) {
        return Swal.fire({ 
            title: 'Erro', 
            text: 'O campo Raça deve ter no mínimo 3 letras!', 
            icon: 'error', 
            background: '#fff', 
            color: '#000' 
        });
    }

    try {
        const token = localStorage.getItem('token');

        // Substituir vírgula por ponto no peso
        const pesoFormatado = peso.replace(',', '.');

        const response = await fetch('http://localhost:5000/api/cadastrar-pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nome, idade: Number(idade), peso: parseFloat(pesoFormatado), raca }),
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
            color: '#000' 
        });
        setForm({ nome: '', idade: '', peso: '', raca: '' });

        navigate('/meus-pets'); // Redirecionar para a página inicial
    } catch (error: any) {
        Swal.fire({ 
            title: 'Erro', 
            text: error.message, 
            icon: 'error', 
            background: '#fff', 
            color: '#000' 
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
                <label htmlFor="idade">Idade</label>
                <input type="number" id="idade" value={form.idade} onChange={handleChange} placeholder="Digite a idade do pet" />
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