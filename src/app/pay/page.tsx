"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DonationModal from '@/components/DonationModal';
import styles from './page.module.css';

type CheckoutState = {
  authorizationUrl: string | null;
  provider: string | null;
  reference: string | null;
  status: string | null;
  transactionId: string | null;
};

const PENDING_DONATION_STORAGE_KEY = 'agr.pendingDonation';

function normalizeStatus(status: string | null): string | null {
  if (!status) {
    return null;
  }

  switch (status.trim().toLowerCase()) {
    case 'success':
    case 'successful':
    case 'completed':
      return 'completed';
    case 'failed':
    case 'error':
      return 'failed';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    case 'pending':
    case 'processing':
      return 'processing';
    case 'sandbox':
      return 'sandbox';
    default:
      return status.trim().toLowerCase();
  }
}

function getProviderLabel(provider: string | null): string {
  if (provider === 'flutterwave') {
    return 'Flutterwave';
  }

  if (provider === 'marzpay') {
    return 'MarzPay';
  }

  return 'our secure checkout';
}

function isTerminalStatus(status: string | null): boolean {
  return status === 'completed' || status === 'failed' || status === 'cancelled';
}

function readStoredCheckout(): CheckoutState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(PENDING_DONATION_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<CheckoutState>;
    return {
      authorizationUrl: typeof parsed.authorizationUrl === 'string' ? parsed.authorizationUrl : null,
      provider: typeof parsed.provider === 'string' ? parsed.provider : null,
      reference: typeof parsed.reference === 'string' ? parsed.reference : null,
      status: normalizeStatus(typeof parsed.status === 'string' ? parsed.status : null),
      transactionId: typeof parsed.transactionId === 'string' ? parsed.transactionId : null,
    };
  } catch {
    return null;
  }
}

function persistCheckout(checkout: CheckoutState) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(PENDING_DONATION_STORAGE_KEY, JSON.stringify(checkout));
  } catch {
    // Ignore storage failures and keep the page functional.
  }
}

function clearStoredCheckout() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.removeItem(PENDING_DONATION_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export default function PayPage() {
  const searchParams = useSearchParams();
  const providerParam = searchParams.get('provider')?.trim().toLowerCase() || null;
  const statusParam = normalizeStatus(searchParams.get('status'));
  const referenceParam =
    searchParams.get('reference') ||
    searchParams.get('tx_ref') ||
    searchParams.get('transaction_id') ||
    searchParams.get('transactionId');
  const chargeIdParam = searchParams.get('chargeId')?.trim() || null;
  const transactionIdParam = searchParams.get('transactionId')?.trim() || null;
  const authorizationUrlParam = searchParams.get('authorizationUrl')?.trim() || null;
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    authorizationUrl: authorizationUrlParam,
    provider: providerParam,
    reference: referenceParam?.trim() || null,
    status: statusParam,
    transactionId: chargeIdParam || transactionIdParam,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);

  useEffect(() => {
    const queryState: CheckoutState = {
      authorizationUrl: authorizationUrlParam,
      provider: providerParam,
      reference: referenceParam?.trim() || null,
      status: statusParam,
      transactionId: chargeIdParam || transactionIdParam,
    };
    const hasQueryState = Object.values(queryState).some(Boolean);

    if (hasQueryState) {
      setCheckoutState(queryState);
      if (isTerminalStatus(queryState.status)) {
        clearStoredCheckout();
      } else {
        persistCheckout(queryState);
      }

      return;
    }

    const storedCheckout = readStoredCheckout();
    if (storedCheckout) {
      setCheckoutState(storedCheckout);
    }
  }, [authorizationUrlParam, chargeIdParam, providerParam, referenceParam, statusParam, transactionIdParam]);

  useEffect(() => {
    setIsOpen(!checkoutState.status && !checkoutState.transactionId);
  }, [checkoutState.status, checkoutState.transactionId]);

  useEffect(() => {
    if (!checkoutState.provider || !checkoutState.transactionId) {
      return;
    }

    if (checkoutState.status !== 'processing' && checkoutState.status !== 'sandbox') {
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const pollStatus = async () => {
      setIsRefreshingStatus(true);

      try {
        const provider = checkoutState.provider;
        const transactionId = checkoutState.transactionId;

        if (!provider || !transactionId) {
          return;
        }

        const params = new URLSearchParams();
        params.set('provider', provider);
        if (provider === 'flutterwave') {
          params.set('chargeId', transactionId);
        } else {
          params.set('transactionId', transactionId);
        }

        const response = await fetch(`/api/donate/status?${params.toString()}`, {
          cache: 'no-store',
        });
        const data = (await response.json().catch(() => null)) as {
          error?: string;
          reference?: string;
          redirectUrl?: string;
          status?: string;
        } | null;

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setStatusError(data?.error || 'Unable to retrieve the latest payment status.');
          timeoutId = setTimeout(pollStatus, 8000);
          return;
        }

        const nextStatus = normalizeStatus(typeof data?.status === 'string' ? data.status : null) || checkoutState.status;
        const nextState: CheckoutState = {
          authorizationUrl:
            typeof data?.redirectUrl === 'string' && data.redirectUrl.trim()
              ? data.redirectUrl.trim()
              : checkoutState.authorizationUrl,
          provider: checkoutState.provider,
          reference:
            typeof data?.reference === 'string' && data.reference.trim()
              ? data.reference.trim()
              : checkoutState.reference,
          status: nextStatus,
          transactionId: checkoutState.transactionId,
        };

        setCheckoutState(nextState);
        setStatusError('');

        if (isTerminalStatus(nextStatus)) {
          clearStoredCheckout();
          return;
        }

        persistCheckout(nextState);
        timeoutId = setTimeout(pollStatus, 5000);
      } catch {
        if (cancelled) {
          return;
        }

        setStatusError('Unable to retrieve the latest payment status.');
        timeoutId = setTimeout(pollStatus, 8000);
      } finally {
        if (!cancelled) {
          setIsRefreshingStatus(false);
        }
      }
    };

    void pollStatus();

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [checkoutState.authorizationUrl, checkoutState.provider, checkoutState.reference, checkoutState.status, checkoutState.transactionId]);

  const providerLabel = getProviderLabel(checkoutState.provider);

  const statusMessage =
    checkoutState.status === 'completed' || checkoutState.status === 'sandbox'
      ? `${providerLabel} confirmed the donation. Thank you for supporting African Girl Rise.`
      : checkoutState.status === 'failed'
        ? `${providerLabel} could not complete the donation. You can try again below.`
        : checkoutState.status === 'cancelled'
          ? `The ${providerLabel} checkout was cancelled before completion. You can try again below.`
          : checkoutState.status
            ? checkoutState.provider === 'flutterwave'
              ? checkoutState.authorizationUrl
                ? 'Continue to Flutterwave to authorise the payment, or approve the prompt on your phone if it already arrived.'
                : 'Flutterwave is still processing the mobile money payment. If prompted, approve it on your phone.'
              : checkoutState.provider === 'marzpay'
                ? 'MarzPay is still processing the donation. You can reopen the donation form below if needed.'
                : 'Your donation is still being processed.'
            : 'Choose mobile money through Flutterwave or card through MarzPay.';

  const helperMessage =
    checkoutState.status === 'processing' || checkoutState.status === 'sandbox'
      ? isRefreshingStatus
        ? `Checking ${providerLabel} for updates...`
        : checkoutState.provider === 'flutterwave'
          ? 'Leave this page open for a moment. We refresh the Flutterwave charge status automatically while it remains pending.'
          : 'We refresh the payment status automatically while it remains pending.'
      : null;

  const handleContinueToFlutterwave = () => {
    if (!checkoutState.authorizationUrl) {
      return;
    }

    window.location.assign(checkoutState.authorizationUrl);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className="serif">Donation checkout</h1>
        <p>{statusMessage}</p>
        {!checkoutState.status && !checkoutState.transactionId ? (
          <p className={styles.providerNote}>
            Mobile money payments go through Flutterwave. Card payments go through MarzPay.
          </p>
        ) : null}
        {checkoutState.reference ? <p className={styles.statusNote}>Reference: {checkoutState.reference}</p> : null}
        {helperMessage ? <p className={styles.helperNote}>{helperMessage}</p> : null}
        {statusError ? <p className={styles.errorNote}>{statusError}</p> : null}

        <div className={styles.buttonRow}>
          {checkoutState.authorizationUrl && checkoutState.provider === 'flutterwave' ? (
            <button type="button" onClick={handleContinueToFlutterwave} className={styles.secondaryAction}>
              Continue to Flutterwave
            </button>
          ) : null}

          <button onClick={() => setIsOpen(true)} className="btn-premium">
            <span>{checkoutState.status || checkoutState.transactionId ? 'Make another donation' : 'Open donation form'}</span>
          </button>
        </div>
      </div>
      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
