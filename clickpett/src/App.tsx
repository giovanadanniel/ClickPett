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
      </Routes>
    </Router>
  );
}

export default App;