import { StatusBadge } from '../StatusBadge/StatusBadge';

interface HistoryItemProps {
  name: string;
  meta: string;
  score: number;
  approved: boolean;
  maxLoan: number;
  id: string;
}

export function HistoryItem({
  name,
  meta,
  score,
  approved,
  maxLoan,
  id,
}: HistoryItemProps) {
  return (
    <li className="history-item">
      <div className="history-item__info">
        <strong>{name}</strong>
        <span className="history-item__meta">{meta}</span>
        <span className="history-item__score">Pontuação: {score}</span>
      </div>
      <div className="history-item__result">
        <StatusBadge approved={approved} />
        {approved && (
          <span className="history-item__amount">
            {maxLoan.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        )}
      </div>
    </li>
  );
}
