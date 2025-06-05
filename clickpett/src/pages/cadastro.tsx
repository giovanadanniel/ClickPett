import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import Swal from 'sweetalert2';
import './style.css';

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
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
    // Máscara para telefone
    const telInput = document.getElementById('telefone') as HTMLInputElement;
    if (telInput) {
      telInput.addEventListener('input', function () {
        const x = telInput.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})/);
        if (x) {
          telInput.value = !x[2]
            ? x[1]
            : `(${x[1]}) ${x[2]}${x[3] ? ` ${x[3]}${x[4] ? `-${x[4]}` : ''}` : ''}`;
        }
      });
    }

    // Força da senha
    const senhaInput = document.getElementById('senha') as HTMLInputElement;
    const strengthBar = document.getElementById('passwordStrengthBar');
    const lengthIcon = document.getElementById('lengthIcon');
    const numberIcon = document.getElementById('numberIcon');
    const specialIcon = document.getElementById('specialIcon');

    console.log({ senhaInput, strengthBar, lengthIcon, numberIcon, specialIcon });

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
    return () => {
      senhaInput.removeEventListener('input', updatePasswordUI);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { nome, email, telefone, senha, confirmarSenha } = form;

    if (!nome.trim()) {
      return Swal.fire({ title: 'Erro', text: 'O campo Nome é obrigatório!', icon: 'error', background: '#121212', color: '#fff' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Swal.fire({ title: 'Erro', text: 'Digite um email válido! Exemplo: nome@exemplo.com', icon: 'error', background: '#121212', color: '#fff' });
    }

    if (checkPasswordStrength(senha) < 3) {
      return Swal.fire({ title: 'Erro', text: 'A senha deve atender a pelo menos 3 dos 4 critérios de força!', icon: 'error', background: '#121212', color: '#fff' });
    }

    if (senha !== confirmarSenha) {
      return Swal.fire({ title: 'Erro', text: 'As senhas não coincidem!', icon: 'error', background: '#121212', color: '#fff' });
    }

    Swal.fire({ title: 'Sucesso!', text: 'Cadastro realizado com sucesso!', icon: 'success', background: '#121212', color: '#fff' });
  };

  return (
    <>
      <header>
        <div className="header-container">
          <img src="/images/logoSemFundo.png" alt="ClickPet Logo" className="logo" />
          <form className="search-bar">
            <input type="text" placeholder="O que seu pet precisa?" />
            <button type="submit">🔍</button>
          </form>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/sobre">Sobre</a></li>
              <li><a href="/servico">Serviços</a></li>
              <li><a href="/contato">Contato</a></li>
            </ul>
          </nav>
          <a href="/login" className="login-btn">Login</a>
        </div>
      </header>

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
                <input type="text" id="nome" placeholder="Digite seu nome completo" value={form.nome} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" placeholder="Digite seu e-mail" value={form.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" placeholder="(00) 0 0000-0000" value={form.telefone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" placeholder="Crie uma senha" value={form.senha} onChange={handleChange} />

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
                    <span>Pelo menos 1 número</span>
                  </div>
                  <div className="requirement">
                    <span className="requirement-icon" id="specialIcon">✗</span>
                    <span>Pelo menos 1 caractere especial</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <input type="password" id="confirmarSenha" placeholder="Confirme sua senha" value={form.confirmarSenha} onChange={handleChange} />
              </div>

              <button type="submit" className="register-btn">Cadastrar</button>
            </form>

            <div className="register-options">
              <p>Já tem uma conta? <a href="/login">Faça login</a></p>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">ClickPet</div>
            <p>Cuidando do seu pet com amor e dedicação desde 2025.</p>
          </div>
          <div className="footer-section">
            <h3>Links Rápidos</h3>
            <ul>
              <li><a href="/sobre">Sobre Nós</a></li>
              <li><a href="/servico">Nossos Serviços</a></li>
              <li><a href="/faq">Perguntas Frequentes</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contato</h3>
            <ul>
              <li>📞 (99) 99999-9999</li>
              <li>✉️ contato@clickpet.com.br</li>
              <li>📍 Curitiba, Brasil</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          &copy; 2023 ClickPet. Todos os direitos reservados.
        </div>
      </footer>
    </>
  );
}
