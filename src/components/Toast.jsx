import { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { useDispatch, useSelector } from '../app/hooks';
import { clearToast } from '../features/ui/uiSlice';

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);
  const toastId = useSelector((state) => state.ui.toastId);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => dispatch(clearToast()), 3000);
    return () => window.clearTimeout(timer);
  }, [toast, toastId, dispatch]);
  if (!toast) return null;
  return <div className="toast" role="status"><span className="toast-check"><Check size={15} /></span><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => dispatch(clearToast())}><X size={15} /></button></div>;
}
