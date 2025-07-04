import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './style.css';

export default function Cadastro() {
  useEffect(() => {
    document.title = 'Cadastro - Click Pet';
  }, []);

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: '',
    confirmarSenha: ''
  });
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // Função para validar CPF (formato e dígitos)
  function validarCPF(cpf: string) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'cpf') {
      // Não permite letras e limita a 11 dígitos
      const onlyNumbers = value.replace(/\D/g, '').slice(0, 11);
      let formattedCPF = onlyNumbers.replace(
        /(\d{3})(\d{3})(\d{3})(\d{0,2})/,
        (match, p1, p2, p3, p4) =>
          p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`
      );
      setForm((prevForm) => ({ ...prevForm, cpf: formattedCPF }));
      return;
    }

    setForm((prevForm) => {
      if (id === 'telefone') {
        const x = value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})/);
        const telefoneFormatado = x
          ? !x[2]
            ? x[1]
            : `(${x[1]}) ${x[2]}${x[3] ? ` ${x[3]}${x[4] ? `-${x[4]}` : ''}` : ''}`
          : value;

        return {
          ...prevForm,
          telefone: telefoneFormatado,
        };
      }

      return {
        ...prevForm,
        [id]: value,
      };
    });
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    const senhaInput = document.getElementById('senha') as HTMLInputElement;
    const strengthBar = document.getElementById('passwordStrengthBar');
    const lengthIcon = document.getElementById('lengthIcon');
    const numberIcon = document.getElementById('numberIcon');
    const specialIcon = document.getElementById('specialIcon');

    if (!senhaInput || !strengthBar || !lengthIcon || !numberIcon || !specialIcon) return;

    const updatePasswordUI = () => {
      const password = senhaInput.value;
      const strength = checkPasswordStrength(password);

      if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '#eee';
      } else {
        const width = (strength / 4) * 100;
        strengthBar.style.width = `${width}%`;

        if (strength <= 1) strengthBar.style.backgroundColor = '#e74c3c';
        else if (strength === 2) strengthBar.style.backgroundColor = '#f39c12';
        else if (strength === 3) strengthBar.style.backgroundColor = '#3498db';
        else strengthBar.style.backgroundColor = '#2ecc71';
      }

      lengthIcon.textContent = password.length >= 8 ? '✓' : '✗';
      lengthIcon.className = password.length >= 8 ? 'requirement-icon requirement-met' : 'requirement-icon requirement-not-met';

      numberIcon.textContent = /\d/.test(password) ? '✓' : '✗';
      numberIcon.className = /\d/.test(password) ? 'requirement-icon requirement-met' : 'requirement-icon requirement-not-met';

      specialIcon.textContent = /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '✗';
      specialIcon.className = /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'requirement-icon requirement-met' : 'requirement-icon requirement-not-met';
    };

    senhaInput.addEventListener('input', updatePasswordUI);
    return () => senhaInput.removeEventListener('input', updatePasswordUI);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  const { nome, email, telefone, cpf, senha, confirmarSenha } = form;

  // Validação de nome: mínimo 3 letras
  if (nome.trim().length < 3) {
    return Swal.fire({
      title: 'Erro',
      text: 'O nome deve ter no mínimo 3 letras!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Swal.fire({
      title: 'Erro',
      text: 'Digite um e-mail válido!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação de telefone
  if (!telefone.trim()) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo Telefone é obrigatório!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  // Validação de CPF
  if (!cpf.trim()) {
    return Swal.fire({
      title: 'Erro',
      text: 'O campo CPF é obrigatório!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  if (!validarCPF(cpf)) {
    return Swal.fire({
      title: 'Erro',
      text: 'Digite um CPF válido!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

// Validação de senha: deve atender os 3 critérios
const senhaForte =
  senha.length >= 8 &&
  /\d/.test(senha) &&
  /[!@#$%^&*(),.?":{}|<>]/.test(senha);

if (!senhaForte) {
  return Swal.fire({
    title: 'Erro',
    text: 'A senha deve atender todos os 3 critérios: mínimo 8 caracteres, conter número e caractere especial!',
    icon: 'error',
    background: '#fff',
    color: '#000',
  });
}

  // Validação de confirmação de senha
  if (senha !== confirmarSenha) {
    return Swal.fire({
      title: 'Erro',
      text: 'As senhas não coincidem!',
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }

  const telefoneSemFormatacao = telefone.replace(/\D/g, '');
  const cpfSemFormatacao = cpf.replace(/\D/g, '');

  try {
    // Verifica se o CPF ou e-mail já existe antes de cadastrar
    const response = await fetch('http://localhost:5000/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone: telefoneSemFormatacao, cpf: cpfSemFormatacao, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao cadastrar cliente!');
    }

    Swal.fire({
      title: 'Sucesso!',
      text: 'Cadastro realizado com sucesso!',
      icon: 'success',
      background: '#fff',
      color: '#000',
    }).then(() => {
      window.location.href = '/login';
    });

    setForm({ nome: '', email: '', telefone: '', cpf: '', senha: '', confirmarSenha: '' });
  } catch (error: any) {
    Swal.fire({
      title: 'Erro',
      text: error.message,
      icon: 'error',
      background: '#fff',
      color: '#000',
    });
  }
};

  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-hero">
          <div className="hero-content">
            <h2>Junte-se à família ClickPet</h2>
            <p>Crie sua conta para acessar todos os nossos serviços e benefícios exclusivos para seu pet.</p>
          </div>
        </div>

        <div className="register-container">
          <div className="register-form-container">
            <h1>Crie sua conta</h1>
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input type="text" id="nome" value={form.nome} onChange={handleChange} placeholder="Digite seu nome completo" />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" value={form.email} onChange={handleChange} placeholder="Digite seu e-mail" />
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 0 0000-0000" />
              </div>
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" value={form.cpf} onChange={handleChange} placeholder="Digite seu CPF" />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showSenha ? 'text' : 'password'}
                    id="senha"
                    value={form.senha}
                    onChange={handleChange}
                    placeholder="Crie uma senha"
                  />
                  <img
                    src={showSenha ? '/paw-off.svg' : '/paw.svg'}
                    alt={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setShowSenha((v) => !v)}
                    style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', width: 22, height: 22 }}
                  />
                </div>
                <div className="password-strength">
                  <div className="password-strength-bar" id="passwordStrengthBar"></div>
                </div>
                <div className="password-requirements">
                  <div className="requirement">
                    <span className="requirement-icon" id="lengthIcon">✗</span>
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div className="requirement">
                    <span className="requirement-icon" id="numberIcon">✗</span>
                    <span>Contém número</span>
                  </div>
                  <div className="requirement">
                    <span className="requirement-icon" id="specialIcon">✗</span>
                    <span>Caractere especial</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmarSenha ? 'text' : 'password'}
                    id="confirmarSenha"
                    value={form.confirmarSenha}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                  />
                  <img
                    src={showConfirmarSenha ? '/paw-off.svg' : '/paw.svg'}
                    alt={showConfirmarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setShowConfirmarSenha((v) => !v)}
                    style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', width: 22, height: 22 }}
                  />
                </div>
              </div>
              <button type="submit" className="register-btn">Cadastrar</button>


            <div className="register-options">
              <p>Já tem uma conta? <a href="/login">Faça login</a></p>
            </div>
            
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
