import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="page page--home">
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
          <button
            className="choice-card"
            onClick={() => navigate('/person')}
            data-testid="btn-person"
          >
            <span className="choice-card__icon">👤</span>
            <span className="choice-card__title">Pessoa Física</span>
            <span className="choice-card__desc">CPF · Renda mensal · Idade</span>
            <span className="choice-card__arrow">→</span>
          </button>

          <button
            className="choice-card"
            onClick={() => navigate('/company')}
            data-testid="btn-company"
          >
            <span className="choice-card__icon">🏢</span>
            <span className="choice-card__title">Pessoa Jurídica</span>
            <span className="choice-card__desc">CNPJ · Faturamento mensal</span>
            <span className="choice-card__arrow">→</span>
          </button>
        </div>

        <footer className="home-footer">
          <button
            className="history-link-btn"
            onClick={() => navigate('/history')}
            data-testid="btn-history"
          >
            📋 Ver histórico de análises
          </button>
        </footer>
      </div>
    </div>
  );
}
