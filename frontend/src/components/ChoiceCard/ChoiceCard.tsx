interface ChoiceCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  testId?: string;
}

export function ChoiceCard({
  icon,
  title,
  description,
  onClick,
  testId,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      className="choice-card"
      onClick={onClick}
      data-testid={testId}
    >
      <span className="choice-card__icon">{icon}</span>
      <span className="choice-card__title">{title}</span>
      <span className="choice-card__desc">{description}</span>
      <span className="choice-card__arrow">→</span>
    </button>
  );
}
