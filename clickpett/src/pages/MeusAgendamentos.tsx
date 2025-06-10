import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Agendamento {
  id: number;
  dataHora: string;
  observacao: string;
  servico: string;
  pet: string;
}

const MeusAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Meus Agendamentos - Click Pet';

    axios.get('http://localhost:5000/api/meus-agendamentos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        setAgendamentos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar agendamentos:', error);
      });
  }, []);

  const handleEditar = (id: number) => {
    navigate(`/editar-agendamento/${id}`);
  };

  const handleExcluir = (id: number) => {
    const confirmacao = window.confirm('Tem certeza de que deseja excluir este agendamento?');
    if (!confirmacao) return;

    axios.delete(`http://localhost:5000/api/agendamento/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        setAgendamentos((prevAgendamentos) => prevAgendamentos.filter((agendamento) => agendamento.id !== id));
        alert('Agendamento excluído com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao excluir agendamento:', error);
        alert('Erro ao excluir o agendamento.');
      });
  };

  return (
    <>
      <Header />
      <main className="agendamentos-container">
        <h1 className="title">Meus Agendamentos</h1>
        <div className="agendamentos-list">
          {agendamentos.map((agendamento) => (
            <div key={agendamento.id} className="agendamento-card">
              <h2>Serviço: {agendamento.servico}</h2>
              <p><strong>Pet:</strong> {agendamento.pet}</p>
              <p><strong>Data e Hora:</strong> {new Date(agendamento.dataHora).toLocaleString()}</p>
              <p><strong>Observação:</strong> {agendamento.observacao || 'Nenhuma observação'}</p>
              <div className="agendamento-actions">
                <button onClick={() => handleEditar(agendamento.id)}>Editar</button>
                <button onClick={() => handleExcluir(agendamento.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MeusAgendamentos;