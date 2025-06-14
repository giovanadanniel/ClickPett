import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import './style.css';

export default function EditarServico() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nomeServico: '',
    precoServico: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const papelUsuario = localStorage.getItem('papelUsuario');

    if (!token || papelUsuario !== '2') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Erro',
        text: 'Token não encontrado! Faça login novamente.',
        icon: 'error',
        background: '#121212',
        color: '#fff',
      });
      return;
    }

    fetch(`http://localhost:5000/api/servico/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.error || 'Erro ao buscar serviço!');
          });
        }
        return response.json();
      })
      .then((data) => {
        setForm({
          nomeServico: data.nome,
          precoServico: data.preco.toString(),
        });
      })
      .catch((error) => {
        console.error('Erro ao buscar serviço:', error.message);
        Swal.fire({
          title: 'Erro',
          text: error.message,
          icon: 'error',
          background: '#121212',
          color: '#fff',
        });
      });
  }, [id]);

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

  // Validação: Nome do serviço não pode exceder 50 caracteres
  if (nomeServico.trim().length > 50) {
    return Swal.fire({
      title: 'Erro',
      text: 'O nome do serviço não pode exceder 50 caracteres!',
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
  if (!token) {
    return Swal.fire({
      title: 'Erro',
      text: 'Token não encontrado! Faça login novamente.',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  try {
    const response = await fetch(`http://localhost:5000/api/servico/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nomeServico, precoServico: preco }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao editar serviço!');
    }

    Swal.fire({
      title: 'Sucesso!',
      text: 'Serviço atualizado com sucesso!',
      icon: 'success',
      background: '#fff',
      color: '#000',
    });

    navigate('/meus-servicos');
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
            <h1>Editar Serviço</h1>
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
                Atualizar
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}