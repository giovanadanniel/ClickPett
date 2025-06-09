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

    if (!nome.trim()) return Swal.fire({ title: 'Erro', text: 'O campo Nome é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });
    if (!idade.trim() || isNaN(Number(idade))) return Swal.fire({ title: 'Erro', text: 'O campo Idade deve ser um número válido!', icon: 'error', background: '#121212', color: '#fff' });
    if (!peso.trim()) return Swal.fire({ title: 'Erro', text: 'O campo Peso é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });
    if (!raca.trim()) return Swal.fire({ title: 'Erro', text: 'O campo Raça é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });

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

        Swal.fire({ title: 'Sucesso!', text: 'Pet cadastrado com sucesso!', icon: 'success', background: '#121212', color: '#fff' });
        setForm({ nome: '', idade: '', peso: '', raca: '' });

        navigate('/'); // Redirecionar para a página inicial
    } catch (error: any) {
        Swal.fire({ title: 'Erro', text: error.message, icon: 'error', background: '#121212', color: '#fff' });
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