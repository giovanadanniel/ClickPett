import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Importar o Header
import Footer from '../components/Footer'; // Importar o Footer
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

  const handleExcluir = (id: number) => {
    const confirmacao = window.confirm('Tem certeza de que deseja excluir este pet?');
    if (!confirmacao) return;

    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/pet/${id}`, { // Corrigido para incluir o host e a porta
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
    })
      .then((response) => {
        if (response.ok) {
          setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
          alert('Pet excluído com sucesso!');
        } else {
          console.error('Erro ao excluir pet');
          alert('Erro ao excluir o pet.');
        }
      })
      .catch((error) => {
        console.error('Erro ao excluir pet:', error);
        alert('Erro ao excluir o pet.');
      });
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