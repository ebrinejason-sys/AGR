import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { AdminToastItem, AdminToastTone } from './useAdminToast';
import styles from './AdminToast.module.css';

function getToastIcon(tone: AdminToastTone) {
    switch (tone) {
        case 'success':
            return <CheckCircle2 size={18} />;
        case 'error':
            return <AlertCircle size={18} />;
        default:
            return <Info size={18} />;
    }
}

export default function AdminToastRegion({ toasts, onDismiss }: { toasts: AdminToastItem[]; onDismiss: (id: number) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className={styles.region} aria-live="polite" aria-atomic="true">
            {toasts.map((toast) => (
                <div key={toast.id} className={`${styles.toast} ${styles[toast.tone]}`} role={toast.tone === 'error' ? 'alert' : 'status'}>
                    <div className={styles.iconWrap}>{getToastIcon(toast.tone)}</div>
                    <div className={styles.content}>
                        <span className={styles.title}>{toast.title}</span>
                        {toast.message && <p className={styles.message}>{toast.message}</p>}
                    </div>
                    <button type="button" className={styles.dismiss} onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}