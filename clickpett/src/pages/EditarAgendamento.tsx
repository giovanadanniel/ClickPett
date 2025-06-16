import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './style.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Servico {
  id: number;
  nome: string;
}

interface Pet {
  id: number;
  nome: string;
}

const EditarAgendamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    servicoId: '',
    petId: '',
    data: '',
    hora: '',
    observacoes: '',
  });

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [precoServico, setPrecoServico] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const papelUsuario = localStorage.getItem('papelUsuario');

    if (!token || papelUsuario !== '1') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    document.title = 'Editar Agendamento - Click Pet';

    // Buscar serviços do banco de dados
    axios.get('http://localhost:5000/api/servicos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        setPets(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar pets:', error);
      });

    // Buscar dados do agendamento
    axios.get(`http://localhost:5000/api/agendamento/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        const { servicoId, petId, dataHora, observacao } = response.data;

        // Converter dataHora para os formatos esperados
        const date = new Date(dataHora);
        const formattedDate = date.toISOString().split('T')[0]; // yyyy-MM-dd
        const formattedTime = date.toTimeString().split(':').slice(0, 2).join(':'); // HH:mm

        setFormData({
          servicoId: servicoId.toString(),
          petId: petId.toString(),
          data: formattedDate,
          hora: formattedTime,
          observacoes: observacao || '',
        });

        // Buscar o preço do serviço inicialmente selecionado
        axios.get(`http://localhost:5000/api/servico/${servicoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((response) => {
            const preco = response.data.preco;
            const formattedPreco = preco.toString().replace('.', ',');
            setPrecoServico(formattedPreco);
          })
          .catch((error) => {
            console.error('Erro ao buscar preço do serviço:', error);
            setPrecoServico('');
          });
      })
      .catch((error) => {
        console.error('Erro ao buscar agendamento:', error);
      });
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServicoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedServicoId = e.target.value;
    setFormData((prev) => ({ ...prev, servicoId: selectedServicoId }));

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

    const { data, hora, observacoes } = formData;

    // Validação: Todos os campos devem estar preenchidos
    if (!formData.servicoId || !formData.petId || !data || !hora || !observacoes.trim()) {
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

      // Comparar horas e minutos
      if (
        horaSelecionada < horaAtual ||
        (horaSelecionada === horaAtual && minutosSelecionados <= minutosAtuais)
      ) {
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

    const agendamentoData = {
      dataHora: `${formData.data} ${formData.hora}`,
      observacao: formData.observacoes,
      servicoId: parseInt(formData.servicoId, 10),
      petId: parseInt(formData.petId, 10),
    };

    axios.put(`http://localhost:5000/api/agendamento/${id}`, agendamentoData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        Swal.fire({
          title: 'Sucesso!',
          text: 'Agendamento atualizado com sucesso!',
          icon: 'success',
          background: '#fff',
          color: '#000',
        });
        navigate('/meus-agendamentos');
      })
      .catch((error) => {
        Swal.fire({
          title: 'Erro',
          text: 'Erro ao atualizar agendamento!',
          icon: 'error',
          background: '#fff',
          color: '#000',
        });
        console.error('Erro ao atualizar agendamento:', error);
      });
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Confirmação',
      text: 'Tem certeza que deseja excluir este agendamento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      color: '#000',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/api/agendamento/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(() => {
            Swal.fire({
              title: 'Sucesso!',
              text: 'Agendamento excluído com sucesso!',
              icon: 'success',
              background: '#fff',
              color: '#000',
            });
            navigate('/meus-agendamentos');
          })
          .catch((error) => {
            Swal.fire({
              title: 'Erro',
              text: 'Erro ao excluir agendamento!',
              icon: 'error',
              background: '#fff',
              color: '#000',
            });
            console.error('Erro ao excluir agendamento:', error);
          });
      }
    });
  };

  const data = formData.data;
  const hora = formData.hora;
  const observacoes = formData.observacoes;

  return (
    <>
      <Header />
      <main className="reserva-container">
        <h1 className="title">Editar Agendamento</h1>
        <form className="reserva-form" onSubmit={handleSubmit}>
          <label htmlFor="servicoId">Escolha o serviço:</label>
          <select
            id="servicoId"
            name="servicoId"
            required
            value={formData.servicoId}
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

          <label htmlFor="petId">Nome do Pet:</label>
          <select
            id="petId"
            name="petId"
            required
            value={formData.petId}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
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

          <button type="submit" className="btn-reserva">Atualizar Agendamento</button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default EditarAgendamento;