import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClickPetHome from './pages/home';
import ClickPetLogin from './pages/login';
import Cadastro from './pages/cadastro';
import ClickPetSobre from './pages/sobre';
import ContatoPage from './pages/cantato';
import Servicos from './pages/servicos';
import ReservaServico from './pages/reserva';
import FAQPage from './pages/faq'; 
import EditarConta from './pages/editarConta';
import CadastrarPet from './pages/cadastroPet';
import MeusPets from './pages/MeusPets';
import EditarPet from './pages/EditarPet';
import CadastroServico from './pages/CadastroServico';
import MeusServicos from './pages/MeusServicos';
import EditarServico from './pages/EditarServico';
import MeusAgendamentos from './pages/MeusAgendamentos';
import EditarAgendamento from './pages/EditarAgendamento';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClickPetHome />} />
        <Route path="/login" element={<ClickPetLogin />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<ClickPetSobre />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/reserva" element={<ReservaServico />} />
        <Route path="/faq" element={<FAQPage />} /> 
        <Route path="/editar-conta" element={<EditarConta />} />
        <Route path="/cadastrar-pet" element={<CadastrarPet />} />
        <Route path="/meus-pets" element={<MeusPets />} />
        <Route path="/editar-pet/:id" element={<EditarPet />} />
        <Route path="/cadastrar-servico" element={<CadastroServico />} />
        <Route path="/meus-servicos" element={<MeusServicos />} />
        <Route path="/editar-servico/:id" element={<EditarServico />} />
        <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
        <Route path="/editar-agendamento/:id" element={<EditarAgendamento />} />
      </Routes>
    </Router>
  );
}

export default App;