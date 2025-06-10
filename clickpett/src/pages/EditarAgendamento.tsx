import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './style.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Servico {
  id: number;
  nome: string;
}

interface Pet {
  id: number;
  nome: string;
}

const EditarAgendamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    servicoId: '',
    petId: '',
    data: '',
    hora: '',
    observacoes: '',
  });

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    document.title = 'Editar Agendamento - Click Pet';

    // Buscar serviços do banco de dados
    axios.get('http://localhost:5000/api/servicos', {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then((response) => {
        setServicos(response.data);
        })
        .catch((error) => {
        console.error('Erro ao buscar serviços:', error);
        });

    // Buscar pets do usuário logado
    axios.get('http://localhost:5000/api/meus-pets', {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then((response) => {
        setPets(response.data);
        })
        .catch((error) => {
        console.error('Erro ao buscar pets:', error);
        });

    // Buscar dados do agendamento
    axios.get(`http://localhost:5000/api/agendamento/${id}`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then((response) => {
        const { servicoId, petId, dataHora, observacao } = response.data;

        // Converter dataHora para os formatos esperados
        const date = new Date(dataHora);
        const formattedDate = date.toISOString().split('T')[0]; // yyyy-MM-dd
        const formattedTime = date.toTimeString().split(':').slice(0, 2).join(':'); // HH:mm

        setFormData({
            servicoId: servicoId.toString(),
            petId: petId.toString(),
            data: formattedDate,
            hora: formattedTime,
            observacoes: observacao || '',
        });
        })
        .catch((error) => {
        console.error('Erro ao buscar agendamento:', error);
        });
    }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const agendamentoData = {
      dataHora: `${formData.data} ${formData.hora}`,
      observacao: formData.observacoes,
      servicoId: parseInt(formData.servicoId, 10),
      petId: parseInt(formData.petId, 10),
    };

    axios.put(`http://localhost:5000/api/agendamento/${id}`, agendamentoData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        alert('Agendamento atualizado com sucesso!');
        navigate('/meus-agendamentos');
      })
      .catch((error) => {
        console.error('Erro ao atualizar agendamento:', error);
        alert('Erro ao atualizar agendamento!');
      });
  };

  const handleDelete = () => {
  if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
    axios.delete(`http://localhost:5000/api/agendamento/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        alert('Agendamento excluído com sucesso!');
        navigate('/meus-agendamentos');
      })
      .catch((error) => {
        console.error('Erro ao excluir agendamento:', error);
        alert('Erro ao excluir agendamento!');
      });
  }
};

  return (
    <>
      <Header />
      <main className="reserva-container">
        <h1 className="title">Editar Agendamento</h1>
        <form className="reserva-form" onSubmit={handleSubmit}>
          <label htmlFor="servicoId">Escolha o serviço:</label>
          <select
            id="servicoId"
            name="servicoId"
            required
            value={formData.servicoId}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.nome}
              </option>
            ))}
          </select>

          <label htmlFor="petId">Nome do Pet:</label>
          <select
            id="petId"
            name="petId"
            required
            value={formData.petId}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.nome}
              </option>
            ))}
          </select>

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

          <button type="submit" className="btn-reserva">Atualizar Agendamento</button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default EditarAgendamento;