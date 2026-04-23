type StatusBannerProps = {
  error: string;
  message: string;
  onDismiss: () => void;
};

export function StatusBanner({ error, message, onDismiss }: StatusBannerProps) {
  if (!error && !message) return null;

  return (
    <div className={`status-banner ${error ? "status-error" : "status-success"}`}>
      <span>{error || message}</span>
      <button className="ghost-inline" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}
