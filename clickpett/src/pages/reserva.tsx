import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './style.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Servico {
  id: number;
  nome: string;
}

interface Pet {
  id: number;
  nome: string;
}

const ReservaServico = () => {
  const [formData, setFormData] = useState({
    servico: '',
    petNome: '',
    data: '',
    hora: '',
    observacoes: '',
  });

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Reserva - Click Pet';

    const token = localStorage.getItem('token');

    // Verificar se o usuário está logado
    if (!token) {
      Swal.fire({
        title: 'Erro',
        text: 'Você precisa estar logado para realizar um agendamento!',
        icon: 'error',
        background: '#fff',
        color: '#000',
      }).then(() => {
        navigate('/servicos'); // Redirecionar para a página de serviços
      });
      return;
    }

    // Buscar serviços do banco de dados
    axios.get('http://localhost:5000/api/servicos', {
      headers: {
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data.length === 0) {
          Swal.fire({
            title: 'Erro',
            text: 'Você precisa cadastrar pelo menos um pet para fazer um agendamento!',
            icon: 'error',
            background: '#fff',
            color: '#000',
          }).then(() => {
            navigate('/servicos'); // Redirecionar para a página de serviços
          });
        } else {
          setPets(response.data);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar pets:', error);
      })
      .finally(() => {
        setLoading(false); // Finalizar o carregamento após as verificações
      });
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Lógica de validação e envio do formulário
  };

  // Exibir um indicador de carregamento enquanto as verificações estão em andamento
  if (loading) {
    return null; // Ou exiba um spinner, como <div>Carregando...</div>
  }

  return (
    <>
      <Header />

      <main className="reserva-container">
        <h1 className="title">Reserve um Serviço</h1>
        <form className="reserva-form" onSubmit={handleSubmit}>
          <label htmlFor="servico">Escolha o serviço:</label>
          <select
            id="servico"
            name="servico"
            required
            value={formData.servico}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.nome}>
                {servico.nome}
              </option>
            ))}
          </select>

          <label htmlFor="petNome">Nome do Pet:</label>
          <select
            id="petNome"
            name="petNome"
            required
            value={formData.petNome}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.nome}>
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

          <button type="submit" className="btn-reserva">Confirmar Reserva</button>
        </form>
      </main>

      <Footer />
    </>
  );
};

export default ReservaServico;