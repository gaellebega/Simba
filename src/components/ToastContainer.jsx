import { useSimba } from '../context/SimbaContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useSimba();

  if (toasts.length === 0) return null;

  return (
    <div className="simba-toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`simba-toast simba-toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button type="button" className="simba-toast-close" onClick={() => dismissToast(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
