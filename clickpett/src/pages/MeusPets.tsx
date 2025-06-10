import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Importar o Header
import Footer from '../components/Footer'; // Importar o Footer
import Swal from 'sweetalert2';
import './style.css';

interface Pet {
  id: number;
  nome: string;
  idade: number;
  peso: number;
  raca: string;
}

const MeusPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Meus Pets - Click Pet';
  }, []);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token não encontrado. Redirecionando para login.');
    navigate('/login');
    return;
  }

  fetch('http://localhost:5000/api/meus-pets', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 403) {
        // Token expirado, tente renovar
        return fetch('http://localhost:5000/api/refresh-token', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((refreshResponse) => {
            if (!refreshResponse.ok) {
              throw new Error('Erro ao renovar o token');
            }
            return refreshResponse.json();
          })
          .then((data) => {
            localStorage.setItem('token', data.token); // Salve o novo token
            // Refaça a requisição original
            return fetch('http://localhost:5000/api/meus-pets', {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            });
          });
      }
      return response;
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao buscar pets');
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setPets(data);
      } else {
        console.error('Resposta inesperada da API:', data);
        setPets([]);
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar pets:', error);
      setPets([]);
    });
}, [navigate]);

  const handleEditar = (id: number) => {
    navigate(`/editar-pet/${id}`);
  };

const handleExcluir = async (id: number) => {
  const token = localStorage.getItem('token');

  // Exibir confirmação antes de excluir
  const confirmacao = await Swal.fire({
    title: 'Confirmação',
    text: 'Tem certeza que deseja excluir este pet?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33', // Cor do botão de confirmação
    cancelButtonColor: '#3085d6', // Cor do botão de cancelamento
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    background: '#fff', // Fundo branco
    color: '#000', // Texto preto
  });

  if (!confirmacao.isConfirmed) {
    return; // Cancelar exclusão
  }

  try {
    const response = await fetch(`http://localhost:5000/api/pet/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao excluir pet!');
    }

    Swal.fire({
      title: 'Sucesso!',
      text: 'Pet excluído com sucesso!',
      icon: 'success',
      background: '#fff', // Fundo branco
      color: '#000', // Texto preto
    });

    // Atualizar a lista de pets após a exclusão
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
  } catch (error: any) {
    Swal.fire({
      title: 'Erro',
      text: error.message,
      icon: 'error',
      background: '#fff', // Fundo branco
      color: '#000', // Texto preto
    });
  }
};

return (
  <>
    <Header /> {/* Adiciona o Header */}
    <div className="meus-pets-container">
      <h1>Meus Pets</h1>
      <div className="pets-list">
        {pets.map((pet) => (
          <div key={pet.id} className="pet-card">
            <h2>{pet.nome}</h2>
            <p>Idade: {pet.idade}</p>
            <p>
              Peso: {pet.peso && !isNaN(Number(pet.peso)) 
                ? (Number.isInteger(Number(pet.peso)) 
                  ? Number(pet.peso) 
                  : Number(pet.peso).toFixed(3).replace('.', ',')) 
                : 'N/A'} kg
            </p> {/* Exibe com até 3 números depois da vírgula */}
            <p>Raça: {pet.raca}</p>
            <div className="pet-actions">
              <button onClick={() => handleEditar(pet.id)}>Editar</button>
              <button onClick={() => handleExcluir(pet.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer /> {/* Adiciona o Footer */}
  </>
);

};

export default MeusPets;