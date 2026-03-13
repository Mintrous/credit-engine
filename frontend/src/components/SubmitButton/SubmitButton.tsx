interface SubmitButtonProps {
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SubmitButton({
  loading,
  children,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="submit-btn"
    >
      {loading ? <span className="btn-spinner" /> : children}
    </button>
  );
}
