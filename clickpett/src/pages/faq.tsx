import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './style.css';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'FAQ - Click Pet';
  }, []);

  const toggleAnswer = (index: string) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
    };

  const perguntas = [
    {
      categoria: "Serviços",
      items: [
        {
          pergunta: "Quais serviços a ClickPet oferece?",
          resposta: "Oferecemos banho e tosa profissional, consultas veterinárias, hospedagem para pets, adestramento básico e venda de produtos de qualidade para seu animal de estimação."
        },
        {
          pergunta: "Preciso agendar com antecedência?",
          resposta: "Recomendamos agendar com pelo menos 24h de antecedência para garantir disponibilidade, especialmente para fins de semana e feriados. Para emergências veterinárias, atendemos sem agendamento."
        },
        {
          pergunta: "Quais os horários de funcionamento?",
          resposta: "Funcionamos de segunda a sexta das 8h às 18h, e aos sábados das 9h às 13h. O hotel para pets funciona 24h para hóspedes."
        }
      ]
    },
    {
      categoria: "Pagamentos e Cancelamentos",
      items: [
        {
          pergunta: "Quais formas de pagamento são aceitas?",
          resposta: "Aceitamos cartões de crédito (todas as bandeiras), débito, PIX, transferência bancária e dinheiro."
        },
        {
          pergunta: "Qual a política de cancelamento?",
          resposta: "Para cancelar sem multa, notifique com pelo menos 12h de antecedência. Cancelamentos em cima da hora podem ser cobrados em 50% do valor do serviço."
        }
      ]
    },
    {
      categoria: "Saúde e Bem-estar",
      items: [
        {
          pergunta: "Meu pet precisa de vacinas atualizadas para usar os serviços?",
          resposta: "Sim, para a segurança de todos os animais, exigimos a carteirinha de vacinação atualizada, especialmente para banho, tosa e hospedagem."
        },
        {
          pergunta: "Como lidam com pets ansiosos ou com medo?",
          resposta: "Nossos profissionais são treinados para lidar com animais ansiosos. Usamos técnicas de aproximação gradual, ambientes tranquilos e, quando necessário, podemos recomendar auxílio de um veterinário comportamental."
        },
        {
          pergunta: "Oferecem serviço veterinário de emergência?",
          resposta: "Sim, temos plantão 24h para emergências veterinárias. Entre em contato pelo telefone (99) 99999-9999 em caso de urgências."
        }
      ]
    },
    {
      categoria: "Outras Dúvidas",
      items: [
        {
          pergunta: "Posso ficar com meu pet durante os procedimentos?",
          resposta: "Na maioria dos casos sim, exceto durante exames ou procedimentos que exigem concentração do veterinário. Para banho e tosa, a presença do tutor pode deixar alguns animais mais agitados."
        },
        {
          pergunta: "Oferecem desconto para múltiplos pets?",
          resposta: "Sim, oferecemos 15% de desconto no segundo pet e 20% a partir do terceiro pet da mesma família para serviços de banho, tosa e hospedagem."
        }
      ]
    }
  ];

  return (
    <div>
      
      <Header /> {/* Usa o componente Header */}

      <main>
        <section className="faq-container">
          <h1 className="title">Perguntas Frequentes</h1>
          <div className="faq-content">
            {perguntas.map((cat, i) => (
              <div key={i} className="faq-category">
                <h3>{cat.categoria}</h3>
                {cat.items.map((item, j) => {
                  const index = `${i}-${j}`;
                  const isActive = activeIndex === index;
                  return (
                    <div className="faq-item" key={index}>
                      <div
                        className={`faq-question ${isActive ? 'active' : ''}`}
                        onClick={() => toggleAnswer(index)}
                      >
                        {item.pergunta}
                      </div>
                      <div className={`faq-answer ${isActive ? 'show' : ''}`}>
                        <p>{item.resposta}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer /> {/* Usa o componente Footer */}
      
    </div>
  );
};

export default FAQPage;
