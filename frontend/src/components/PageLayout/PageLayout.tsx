interface PageLayoutProps {
  children: React.ReactNode;
  /** Optional inner wrapper class (e.g. form-page, result-page, history-page) */
  innerClassName?: string;
  /** Optional outer page class (e.g. page--home) */
  className?: string;
}

export function PageLayout({
  children,
  innerClassName,
  className = 'page',
}: PageLayoutProps) {
  return (
    <div className={className}>
      {innerClassName ? (
        <div className={innerClassName}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
