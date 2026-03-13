import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { ChoiceCard } from '../../components/ChoiceCard/ChoiceCard';
import { useCreditContext } from '../../context/CreditContext';

export function Home() {
  const navigate = useNavigate();
  const { state } = useCreditContext();

  useEffect(() => {
    if (state) navigate('/result');
  }, [state, navigate]);

  return (
    <PageLayout className="page page--home">
      <div className="home-content">
        <header className="home-header">
          <div className="brand">
            <span className="brand-name">CredScore</span>
          </div>
          <h1 className="home-title">
            Análise de<br />
            <em>Crédito</em>
          </h1>
          <p className="home-subtitle">
            Descubra sua capacidade de empréstimo em instantes.
          </p>
        </header>

        <div className="choice-grid">
          <ChoiceCard
            icon="👤"
            title="Pessoa Física"
            description="CPF · Renda mensal · Idade"
            onClick={() => navigate('/person')}
            testId="btn-person"
          />
          <ChoiceCard
            icon="🏢"
            title="Pessoa Jurídica"
            description="CNPJ · Faturamento mensal"
            onClick={() => navigate('/company')}
            testId="btn-company"
          />
        </div>

        <footer className="home-footer">
          <button
            type="button"
            className="history-link-btn"
            onClick={() => navigate('/history')}
            data-testid="btn-history"
          >
            📋 Ver histórico de análises
          </button>
        </footer>
      </div>
    </PageLayout>
  );
}
