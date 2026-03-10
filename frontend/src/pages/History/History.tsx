import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreditAnalysis, LegalEntityAnalysis } from '../../types/credit';

const HISTORY_STORAGE_KEY = 'credit_engine_history';

interface StoredHistory {
  naturalPersons: CreditAnalysis[];
  legalEntities: LegalEntityAnalysis[];
}

function loadHistoryFromStorage(): StoredHistory {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredHistory) : { naturalPersons: [], legalEntities: [] };
  } catch {
    return { naturalPersons: [], legalEntities: [] };
  }
}

export function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<StoredHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadHistoryFromStorage();
    setHistory(stored);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="history-page">
          <header className="form-header">
            <button className="back-btn" onClick={() => navigate('/result')}>
              ← Voltar
            </button>
            <h1 className="form-title">Histórico de análises</h1>
          </header>
          <p className="history-loading">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!history) {
    return (
      <div className="page">
        <div className="history-page">
          <header className="form-header">
            <button className="back-btn" onClick={() => navigate('/result')}>
              ← Voltar
            </button>
            <h1 className="form-title">Histórico de análises</h1>
          </header>
          <p className="api-error">Não foi possível carregar o histórico.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="history-page">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate('/result')}>
            ← Voltar
          </button>
          <h1 className="form-title">Histórico de análises</h1>
        </header>

        <section className="history-section" data-testid="persons-section">
          <h2 className="history-section__title">
            Pessoas Físicas
            <span className="history-section__count">{history.naturalPersons.length}</span>
          </h2>

          {history.naturalPersons.length === 0 ? (
            <p className="history-empty">Nenhum registro encontrado.</p>
          ) : (
            <ul className="history-list">
              {history.naturalPersons.map((item) => (
                <li key={item.id} className="history-item">
                  <div className="history-item__info">
                    <strong>{item.name}</strong>
                    <span className="history-item__meta">
                      {item.city} · CPF {item.cpf}
                    </span>
                    <span className="history-item__score">Pontuação: {item.score}</span>
                  </div>
                  <div className="history-item__result">
                    <span
                      className={`status-badge ${
                        item.approved ? 'status-badge--approved' : 'status-badge--denied'
                      }`}
                    >
                      {item.approved ? 'Aprovado' : 'Negado'}
                    </span>
                    {item.approved && (
                      <span className="history-item__amount">
                        {item.maxLoan.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="history-section" data-testid="companies-section">
          <h2 className="history-section__title">
            Pessoas Jurídicas
            <span className="history-section__count">{history.legalEntities.length}</span>
          </h2>

          {history.legalEntities.length === 0 ? (
            <p className="history-empty">Nenhum registro encontrado.</p>
          ) : (
            <ul className="history-list">
              {history.legalEntities.map((item) => (
                <li key={item.id} className="history-item">
                  <div className="history-item__info">
                    <strong>{item.companyName}</strong>
                    <span className="history-item__meta">
                      {item.city} · CNPJ {item.cnpj}
                    </span>
                    <span className="history-item__score">Pontuação: {item.score}</span>
                  </div>
                  <div className="history-item__result">
                    <span
                      className={`status-badge ${
                        item.approved ? 'status-badge--approved' : 'status-badge--denied'
                      }`}
                    >
                      {item.approved ? 'Aprovado' : 'Negado'}
                    </span>
                    {item.approved && (
                      <span className="history-item__amount">
                        {item.maxLoan.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
