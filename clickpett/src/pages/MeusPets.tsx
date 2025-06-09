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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/api/meus-pets', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPets(data))
      .catch((error) => console.error('Erro ao buscar pets:', error));
  }, [navigate]);

  const handleEditar = (id: number) => {
    navigate(`/editar-pet/${id}`);
  };

  const handleExcluir = (id: number) => {
    const token = localStorage.getItem('token');
    fetch(`/api/pet/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
        } else {
          console.error('Erro ao excluir pet');
        }
      })
      .catch((error) => console.error('Erro ao excluir pet:', error));
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
              <p>Idade: {pet.idade} anos</p>
              <p>Peso: {pet.peso} kg</p>
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