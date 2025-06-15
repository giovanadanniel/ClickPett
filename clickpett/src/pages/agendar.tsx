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

const AgendarServico = () => {
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
  const [precoServico, setPrecoServico] = useState<string>('');
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

  const handleServicoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedServicoId = e.target.value;
    setFormData((prev) => ({ ...prev, servico: selectedServicoId }));

    // Fetch the price of the selected service
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/api/servico/${selectedServicoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const preco = response.data.preco;
        // Format the price to use a comma instead of a dot
        const formattedPreco = preco.toString().replace('.', ',');
        setPrecoServico(formattedPreco);
      })
      .catch((error) => {
        console.error('Erro ao buscar preço do serviço:', error);
        setPrecoServico('');
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire({
        title: 'Erro',
        text: 'Você precisa estar logado para realizar um agendamento!',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
      return;
    }

    const { servico, petNome, data, hora, observacoes } = formData;

    if (!servico || !petNome || !data || !hora) {
      Swal.fire({
        title: 'Erro',
        text: 'Todos os campos obrigatórios devem ser preenchidos!',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
      return;
    }

    // Validação: Observações não podem exceder 200 caracteres
    if (observacoes.trim().length > 200) {
      return Swal.fire({
        title: 'Erro',
        text: 'O campo Observações não pode exceder 200 caracteres!',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/agendamento',
        {
          dataHora: `${data}T${hora}`,
          observacao: observacoes,
          servicoId: servico,
          petId: pets.find((pet) => pet.nome === petNome)?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: 'Sucesso',
        text: 'Reserva realizada com sucesso!',
        icon: 'success',
        background: '#fff',
        color: '#000',
      }).then(() => {
        navigate('/meus-agendamentos'); // Redirecionar para a página de agendamentos
      });
    } catch (error) {
      console.error('Erro ao enviar reserva:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao realizar a reserva. Tente novamente mais tarde.',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
    }
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
            onChange={handleServicoChange}
          >
            <option value="">Selecione...</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.nome}
              </option>
            ))}
          </select>

          {precoServico && (
            <p className="preco-servico">Preço: R$ {precoServico}</p>
          )}

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

          <label htmlFor="hora">Horário(08:00-20:00):</label>
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

export default AgendarServico;