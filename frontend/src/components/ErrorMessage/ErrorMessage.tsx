interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export function ErrorMessage({
  children,
  className = 'api-error',
}: ErrorMessageProps) {
  return (
    <p className={className} role="alert">
      {children}
    </p>
  );
}
