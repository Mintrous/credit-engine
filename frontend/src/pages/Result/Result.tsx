import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreditContext } from '../../context/CreditContext';
import type { CreditAnalysis, LegalEntityAnalysis } from '../../types/credit';
import { PageLayout } from '../../components/PageLayout/PageLayout';

export function Result() {
  const navigate = useNavigate();
  const { state, clearResult } = useCreditContext();

  useEffect(() => {
    if (!state) navigate('/');
  }, [state, navigate]);

  if (!state) return null;

  const { analysis, customerType } = state;
  const approved = analysis.approved;

  const isNaturalPerson = customerType === 'natural_person';
  const entityName = isNaturalPerson
    ? (analysis as CreditAnalysis).name
    : (analysis as LegalEntityAnalysis).companyName;
  const typeLabel = isNaturalPerson ? 'Pessoa Física' : 'Pessoa Jurídica';

  const handleRestart = () => {
    clearResult();
    navigate('/');
  };

  return (
    <PageLayout innerClassName="result-page">
      <div className={`result-card ${approved ? 'result-card--approved' : 'result-card--denied'}`}>
        <div className="result-card__status-icon" aria-hidden>
          {approved ? '✓' : '✗'}
        </div>

        <p className="result-card__type">{typeLabel}</p>
        <h1 className="result-card__name">{entityName}</h1>

        <div className={`result-badge ${approved ? 'result-badge--approved' : 'result-badge--denied'}`}>
          {approved ? 'CRÉDITO APROVADO' : 'CRÉDITO NEGADO'}
        </div>

        <div className="result-score">
          <span className="result-score__label">Pontuação</span>
          <span className="result-score__value" data-testid="score">
            {analysis.score}
          </span>
        </div>

        {approved && (
          <div className="result-amount">
            <span className="result-amount__label">Valor máximo disponível</span>
            <span className="result-amount__value" data-testid="max-amount">
              {analysis.maxLoan.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        )}
      </div>

      <div className="result-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={handleRestart}
          data-testid="btn-restart"
        >
          Refazer análise
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate('/history')}
          data-testid="btn-history"
        >
          Ver histórico de análises
        </button>
      </div>
    </PageLayout>
  );
}
