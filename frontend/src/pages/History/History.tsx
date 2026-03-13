import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreditAnalysis, LegalEntityAnalysis } from '../../types/credit';
import { getJsonItem } from '../../shared/storage/localStorage';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { HistoryItem } from '../../components/HistoryItem/HistoryItem';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';

const HISTORY_STORAGE_KEY = 'credit_engine_history';

interface StoredHistory {
  naturalPersons: CreditAnalysis[];
  legalEntities: LegalEntityAnalysis[];
}

function loadHistoryFromStorage(): StoredHistory {
  return (
    getJsonItem<StoredHistory>(HISTORY_STORAGE_KEY, {
      fallback: { naturalPersons: [], legalEntities: [] },
    }) ?? { naturalPersons: [], legalEntities: [] }
  );
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
      <PageLayout innerClassName="history-page">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate('/result')}>
            ← Voltar
          </button>
          <h1 className="form-title">Histórico de análises</h1>
        </header>
        <p className="history-loading">Carregando...</p>
      </PageLayout>
    );
  }

  if (!history) {
    return (
      <PageLayout innerClassName="history-page">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate('/result')}>
            ← Voltar
          </button>
          <h1 className="form-title">Histórico de análises</h1>
        </header>
        <ErrorMessage>Não foi possível carregar o histórico.</ErrorMessage>
      </PageLayout>
    );
  }

  return (
    <PageLayout innerClassName="history-page">
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
              <HistoryItem
                key={item.id}
                id={item.id}
                name={item.name}
                meta={`${item.city} · CPF ${item.cpf}`}
                score={item.score}
                approved={item.approved}
                maxLoan={item.maxLoan}
              />
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
              <HistoryItem
                key={item.id}
                id={item.id}
                name={item.companyName}
                meta={`${item.city} · CNPJ ${item.cnpj}`}
                score={item.score}
                approved={item.approved}
                maxLoan={item.maxLoan}
              />
            ))}
          </ul>
        )}
      </section>
    </PageLayout>
  );
}
