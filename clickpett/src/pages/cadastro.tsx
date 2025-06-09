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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

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

      if (id === 'cpf') {
        const formattedCPF = value.replace(/\D/g, '').replace(
          /(\d{3})(\d{3})(\d{3})(\d{0,2})/,
          (match, p1, p2, p3, p4) =>
            p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`
        );
        return {
          ...prevForm,
          cpf: formattedCPF,
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

    if (!nome.trim()) return Swal.fire({ title: 'Erro', text: 'O campo Nome é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });
    if (!telefone.trim()) return Swal.fire({ title: 'Erro', text: 'O campo Telefone é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });
    if (!cpf.trim()) return Swal.fire({ title: 'Erro', text: 'O campo CPF é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return Swal.fire({ title: 'Erro', text: 'Digite um email válido!', icon: 'error', background: '#121212', color: '#fff' });

    if (checkPasswordStrength(senha) < 3) return Swal.fire({ title: 'Erro', text: 'A senha deve atender a pelo menos 3 dos 4 critérios de força!', icon: 'error', background: '#121212', color: '#fff' });
    if (senha !== confirmarSenha) return Swal.fire({ title: 'Erro', text: 'As senhas não coincidem!', icon: 'error', background: '#121212', color: '#fff' });

    const telefoneSemFormatacao = telefone.replace(/\D/g, '');
    const cpfSemFormatacao = cpf.replace(/\D/g, '');

    try {
      const response = await fetch('http://localhost:5000/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone: telefoneSemFormatacao, cpf: cpfSemFormatacao, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cadastrar cliente!');
      }

      Swal.fire({ title: 'Sucesso!', text: 'Cadastro realizado com sucesso!', icon: 'success', background: '#121212', color: '#fff' })
        .then(() => {
          window.location.href = '/login';
        });
      setForm({ nome: '', email: '', telefone: '', cpf: '', senha: '', confirmarSenha: '' });
    } catch (error: any) {
      Swal.fire({ title: 'Erro', text: error.message, icon: 'error', background: '#121212', color: '#fff' });
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
