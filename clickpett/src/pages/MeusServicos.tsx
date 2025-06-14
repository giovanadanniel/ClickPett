import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import './style.css';

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

const MeusServicos: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const clienteId = localStorage.getItem('clienteId'); // Recuperar o ID do cliente do localStorage

    if (!token || !clienteId) {
        alert('Token ou ID do cliente não encontrado! Faça login novamente.');
        return;
    }

    fetch(`http://localhost:5000/api/meus-servicos?clienteId=${clienteId}`, {
        headers: {
        Authorization: `Bearer ${token}`, // Enviar o token no cabeçalho
        },
    })
        .then((response) => {
        if (!response.ok) {
            return response.json().then((error) => {
            throw new Error(error.error || 'Erro ao buscar serviços!');
            });
        }
        return response.json();
        })
        .then((data) => {
        // Garantir que o preço seja tratado como número
        const servicosFormatados = data.map((servico: any) => ({
            ...servico,
            preco: parseFloat(servico.preco), // Converter para número
        }));
        setServicos(servicosFormatados);
        setLoading(false);
        })
        .catch((error) => {
        console.error('Erro ao buscar serviços:', error.message);
        setLoading(false);
        });
    }, []);

  const handleEditar = (id: number) => {
    navigate(`/editar-servico/${id}`);
  };

  const handleExcluir = (id: number) => {
    Swal.fire({
      title: 'Tem certeza de que deseja excluir este serviço?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/servico/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              setServicos((prevServicos) => prevServicos.filter((servico) => servico.id !== id));
              Swal.fire('Excluído!', 'O serviço foi excluído com sucesso.', 'success');
            } else {
              Swal.fire('Erro!', 'Erro ao excluir o serviço.', 'error');
            }
          })
          .catch((error) => {
            console.error('Erro ao excluir serviço:', error);
            Swal.fire('Erro!', 'Erro ao excluir o serviço.', 'error');
          });
      }
    });
  };

  return (
    <>
      <Header />
      <div className="meus-servicos-page">
        <h1>Meus Serviços</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : servicos.length > 0 ? (
          <div className="servicos-list">
            {servicos.map((servico) => (
              <div key={servico.id} className="servico-card">
                <h2>{servico.nome}</h2>
                <p>Preço: R$ {servico.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div className="servico-actions">
                  <button onClick={() => handleEditar(servico.id)}>Editar</button>
                  <button onClick={() => handleExcluir(servico.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Você ainda não cadastrou nenhum serviço.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MeusServicos;