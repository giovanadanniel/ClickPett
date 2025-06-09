import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './style.css';

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

const MeusServicos: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

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
                <p>Preço: R$ {servico.preco.toFixed(2)}</p>
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