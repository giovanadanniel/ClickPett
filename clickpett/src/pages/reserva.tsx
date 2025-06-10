import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './style.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Definir tipos para os serviços e pets
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
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Reserva - Click Pet';

    // Buscar serviços do banco de dados
    axios.get('http://localhost:5000/api/servicos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Adicione o token do usuário logado
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
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Adicione o token do usuário logado
      },
    })
      .then((response) => {
        setPets(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar pets:', error);
      });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const { servico, petNome, data, hora, observacoes } = formData;

  // Validação: Todos os campos devem estar preenchidos
  if (!servico || !petNome || !data || !hora || !observacoes.trim()) {
    return Swal.fire({
      title: 'Erro',
      text: 'Todos os campos devem estar preenchidos!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  const hoje = new Date();
  const hojeSemHoras = new Date();
  hojeSemHoras.setHours(0, 0, 0, 0);

  const dataSelecionada = new Date(data);

  // Normalizar para UTC para evitar problemas de fuso horário
  const hojeUTC = hojeSemHoras.toISOString().split('T')[0];
  const dataSelecionadaUTC = dataSelecionada.toISOString().split('T')[0];

  // Validação: Data não pode ser passada
  if (dataSelecionadaUTC < hojeUTC) {
    return Swal.fire({
      title: 'Erro',
      text: 'A data deve ser hoje ou futura!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação: Data pode ser no máximo um ano à frente
  const umAnoDepois = new Date();
  umAnoDepois.setFullYear(hoje.getFullYear() + 1);
  const umAnoDepoisUTC = umAnoDepois.toISOString().split('T')[0];

  if (dataSelecionadaUTC > umAnoDepoisUTC) {
    return Swal.fire({
      title: 'Erro',
      text: 'A data não pode ser mais de um ano à frente!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  const horaSelecionada = parseInt(hora.split(':')[0], 10); // Obter a hora como número
  const minutosSelecionados = parseInt(hora.split(':')[1], 10); // Obter os minutos como número

  // Validação: Horário deve estar entre 8:00 e 20:00
  if (horaSelecionada < 8 || horaSelecionada > 20 || (horaSelecionada === 20 && minutosSelecionados > 0)) {
    return Swal.fire({
      title: 'Erro',
      text: 'O horário deve estar entre 08:00 e 20:00!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação: Se a data for hoje, o horário não pode ter passado
  if (dataSelecionadaUTC === hojeUTC) {
    const horaAtual = hoje.getHours();
    const minutosAtuais = hoje.getMinutes();

    if (horaSelecionada < horaAtual || (horaSelecionada === horaAtual && minutosSelecionados < minutosAtuais)) {
      return Swal.fire({
        title: 'Erro',
        text: 'O horário selecionado já passou!',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
    }
  }

  // Validação: Observações devem ter no mínimo 3 letras
  if (observacoes.trim().length < 3) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Observações deve ter no mínimo 3 letras!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Montar os dados para enviar ao backend
  const agendamentoData = {
    dataHora: `${data} ${hora}`, // Combinar data e hora
    observacao: observacoes,
    servicoId: servicos.find((s) => s.nome === servico)?.id, // Obter o ID do serviço
    petId: pets.find((p) => p.nome === petNome)?.id, // Obter o ID do pet
  };

  // Enviar os dados para o backend
  axios.post('http://localhost:5000/api/agendamento', agendamentoData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Adicione o token do usuário logado
    },
  })
    .then((response) => {
      Swal.fire({
        title: 'Sucesso!',
        text: 'Agendamento criado com sucesso!',
        icon: 'success',
        background: '#fff',
        color: '#000',
      });

      navigate('/meus-agendamentos');
      console.log('Agendamento criado com sucesso:', response.data);
    })
    .catch((error) => {
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao criar agendamento!',
        icon: 'error',
        background: '#fff',
        color: '#000',
      });
      console.error('Erro ao criar agendamento:', error);
    });
};

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