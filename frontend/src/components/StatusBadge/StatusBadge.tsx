interface StatusBadgeProps {
  approved: boolean;
}

export function StatusBadge({ approved }: StatusBadgeProps) {
  return (
    <span
      className={`status-badge ${
        approved ? 'status-badge--approved' : 'status-badge--denied'
      }`}
    >
      {approved ? 'Aprovado' : 'Negado'}
    </span>
  );
}
