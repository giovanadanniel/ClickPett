import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './style.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

interface Agendamento {
  id: number;
  dataHora: string;
  observacao: string;
  servico: string;
  pet: string;
  preco: number; // Add price to the interface
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
        const agendamentosComPreco = response.data.map((agendamento: any) => ({
          ...agendamento,
          preco: parseFloat(agendamento.preco), // Ensure price is a number
        }));
        setAgendamentos(agendamentosComPreco);
      })
      .catch((error) => {
        console.error('Erro ao buscar agendamentos:', error);
      });
  }, []);

  const handleEditar = (id: number) => {
    navigate(`/editar-agendamento/${id}`);
  };

const handleExcluir = (id: number) => {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Você não poderá reverter esta ação!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    background: '#fff', // Fundo branco
    color: '#000', // Texto preto
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://localhost:5000/api/agendamento/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(() => {
          setAgendamentos((prevAgendamentos) => prevAgendamentos.filter((agendamento) => agendamento.id !== id));
          Swal.fire('Excluído!', 'O agendamento foi excluído com sucesso.', 'success');
        })
        .catch((error) => {
          console.error('Erro ao excluir agendamento:', error);
          Swal.fire('Erro!', 'Não foi possível excluir o agendamento.', 'error');
        });
    }
  });
};

  return (
    <>
      <Header />
      <main className="agendamentos-container">
        <h1 className="title">Meus Agendamentos</h1>
        {agendamentos.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-calendar-x fs-1 mb-3"></i>
            <h5>Nenhum agendamento encontrado</h5>
            <p className="mb-0">Você ainda não fez nenhum agendamento ou não há agendamentos com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="agendamentos-list">
            {agendamentos.map((agendamento) => (
              <div key={agendamento.id} className="agendamento-card">
                <h2>Serviço: {agendamento.servico}</h2>
                <p><strong>Pet:</strong> {agendamento.pet}</p>
                <p><strong>Data e Hora:</strong> {new Date(agendamento.dataHora).toLocaleString()}</p>
                <p><strong>Observação:</strong> {agendamento.observacao || 'Nenhuma observação'}</p>
                <p><strong>Preço do Serviço:</strong> R$ {agendamento.preco.toFixed(2).replace('.', ',')}</p>
                <div className="agendamento-actions">
                  <button onClick={() => handleEditar(agendamento.id)}>Editar</button>
                  <button onClick={() => handleExcluir(agendamento.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default MeusAgendamentos;