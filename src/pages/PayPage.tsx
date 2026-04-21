import { useEffect, useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
const DonationModal = lazy(() => import('@/components/DonationModal'));
import styles from './PayPage.module.css';

type CheckoutState = { authorizationUrl: string | null; provider: string | null; reference: string | null; status: string | null; transactionId: string | null };

const STORAGE_KEY = 'agr.pendingDonation';

function normalizeStatus(s: string | null): string | null {
    if (!s) return null;
    switch (s.trim().toLowerCase()) {
        case 'success': case 'successful': case 'completed': return 'completed';
        case 'failed': case 'error': return 'failed';
        case 'cancelled': case 'canceled': return 'cancelled';
        case 'pending': case 'processing': return 'processing';
        case 'sandbox': return 'sandbox';
        default: return s.trim().toLowerCase();
    }
}

function getProviderLabel(p: string | null) {
    if (p === 'flutterwave') return 'Flutterwave';
    if (p === 'marzpay') return 'MarzPay';
    return 'our secure checkout';
}

function isTerminal(s: string | null) { return s === 'completed' || s === 'failed' || s === 'cancelled'; }

function readStored(): CheckoutState | null {
    try { const r = window.sessionStorage.getItem(STORAGE_KEY); if (!r) return null; const p = JSON.parse(r) as Partial<CheckoutState>; return { authorizationUrl: typeof p.authorizationUrl === 'string' ? p.authorizationUrl : null, provider: typeof p.provider === 'string' ? p.provider : null, reference: typeof p.reference === 'string' ? p.reference : null, status: normalizeStatus(typeof p.status === 'string' ? p.status : null), transactionId: typeof p.transactionId === 'string' ? p.transactionId : null }; } catch { return null; }
}
function persist(c: CheckoutState) { try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch { /* ignore */ } }
function clearStored() { try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } }

export default function PayPage() {
    const [searchParams] = useSearchParams();
    const providerParam = searchParams.get('provider')?.trim().toLowerCase() || null;
    const statusParam = normalizeStatus(searchParams.get('status'));
    const referenceParam = searchParams.get('reference') || searchParams.get('tx_ref') || searchParams.get('transaction_id') || searchParams.get('transactionId');
    const chargeIdParam = searchParams.get('chargeId')?.trim() || null;
    const transactionIdParam = searchParams.get('transactionId')?.trim() || null;
    const authorizationUrlParam = searchParams.get('authorizationUrl')?.trim() || null;

    const [checkoutState, setCheckoutState] = useState<CheckoutState>({ authorizationUrl: authorizationUrlParam, provider: providerParam, reference: referenceParam?.trim() || null, status: statusParam, transactionId: chargeIdParam || transactionIdParam });
    const [isOpen, setIsOpen] = useState(false);
    const [statusError, setStatusError] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const q: CheckoutState = { authorizationUrl: authorizationUrlParam, provider: providerParam, reference: referenceParam?.trim() || null, status: statusParam, transactionId: chargeIdParam || transactionIdParam };
        if (Object.values(q).some(Boolean)) {
            setCheckoutState(q);
            if (isTerminal(q.status)) clearStored(); else persist(q);
            return;
        }
        const stored = readStored(); if (stored) setCheckoutState(stored);
    }, [authorizationUrlParam, chargeIdParam, providerParam, referenceParam, statusParam, transactionIdParam]);

    useEffect(() => { setIsOpen(!checkoutState.status && !checkoutState.transactionId); }, [checkoutState.status, checkoutState.transactionId]);

    useEffect(() => {
        if (!checkoutState.provider || !checkoutState.transactionId) return;
        if (checkoutState.status !== 'processing' && checkoutState.status !== 'sandbox') return;
        let cancelled = false; let tid: ReturnType<typeof setTimeout> | undefined;
        const poll = async () => {
            setIsRefreshing(true);
            try {
                const params = new URLSearchParams(); params.set('provider', checkoutState.provider!);
                if (checkoutState.provider === 'flutterwave') params.set('chargeId', checkoutState.transactionId!); else params.set('transactionId', checkoutState.transactionId!);
                const r = await fetch(`/api/donate/status?${params}`, { cache: 'no-store' });
                const data = await r.json().catch(() => null) as { error?: string; reference?: string; redirectUrl?: string; status?: string } | null;
                if (cancelled) return;
                if (!r.ok) { setStatusError(data?.error || 'Unable to retrieve payment status.'); tid = setTimeout(poll, 8000); return; }
                const nextStatus = normalizeStatus(typeof data?.status === 'string' ? data.status : null) || checkoutState.status;
                const next: CheckoutState = { authorizationUrl: typeof data?.redirectUrl === 'string' && data.redirectUrl.trim() ? data.redirectUrl.trim() : checkoutState.authorizationUrl, provider: checkoutState.provider, reference: typeof data?.reference === 'string' && data.reference.trim() ? data.reference.trim() : checkoutState.reference, status: nextStatus, transactionId: checkoutState.transactionId };
                setCheckoutState(next); setStatusError('');
                if (isTerminal(nextStatus)) { clearStored(); return; }
                persist(next); tid = setTimeout(poll, 5000);
            } catch { if (!cancelled) { setStatusError('Unable to retrieve payment status.'); tid = setTimeout(poll, 8000); } }
            finally { if (!cancelled) setIsRefreshing(false); }
        };
        void poll();
        return () => { cancelled = true; if (tid) clearTimeout(tid); };
    }, [checkoutState.authorizationUrl, checkoutState.provider, checkoutState.reference, checkoutState.status, checkoutState.transactionId]);

    const providerLabel = getProviderLabel(checkoutState.provider);
    const statusMessage = checkoutState.status === 'completed' || checkoutState.status === 'sandbox' ? `${providerLabel} confirmed the donation. Thank you for supporting African Girl Rise.` : checkoutState.status === 'failed' ? `${providerLabel} could not complete the donation. You can try again below.` : checkoutState.status === 'cancelled' ? `The ${providerLabel} checkout was cancelled. You can try again below.` : checkoutState.status ? checkoutState.provider === 'flutterwave' ? checkoutState.authorizationUrl ? 'Continue to Flutterwave to authorise the payment, or approve the prompt on your phone.' : 'Flutterwave is still processing the mobile money payment.' : checkoutState.provider === 'marzpay' ? 'MarzPay is still processing the donation.' : 'Your donation is still being processed.' : 'Choose mobile money through Flutterwave or card through MarzPay.';
    const helperMessage = checkoutState.status === 'processing' || checkoutState.status === 'sandbox' ? isRefreshing ? `Checking ${providerLabel} for updates...` : 'We refresh the payment status automatically.' : null;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className="serif">Donation checkout</h1>
                <p>{statusMessage}</p>
                {!checkoutState.status && !checkoutState.transactionId && <p className={styles.providerNote}>Mobile money payments go through Flutterwave. Card payments go through MarzPay.</p>}
                {checkoutState.reference && <p className={styles.statusNote}>Reference: {checkoutState.reference}</p>}
                {helperMessage && <p className={styles.helperNote}>{helperMessage}</p>}
                {statusError && <p className={styles.errorNote}>{statusError}</p>}
                <div className={styles.buttonRow}>
                    {checkoutState.authorizationUrl && checkoutState.provider === 'flutterwave' && <button type="button" onClick={() => window.location.assign(checkoutState.authorizationUrl!)} className={styles.secondaryAction}>Continue to Flutterwave</button>}
                    <button onClick={() => setIsOpen(true)} className="btn-premium"><span>{checkoutState.status || checkoutState.transactionId ? 'Make another donation' : 'Open donation form'}</span></button>
                </div>
            </div>
            <Suspense fallback={null}>
                <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </Suspense>
        </div>
    );
}
