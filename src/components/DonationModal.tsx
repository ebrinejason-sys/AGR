"use client";

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './DonationModal.module.css';
import type { DonationMethod, DonationProvider } from '@/lib/marzpay';

type DonationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventTitle?: string;
};

type MobileMoneyNetwork = 'MTN' | 'Airtel';

type DonationApiResponse = {
  authorizationUrl?: string;
  error?: string;
  provider?: DonationProvider;
  redirectUrl?: string;
  reference?: string;
  status?: string;
  transactionId?: string;
};

const QUICK_AMOUNTS = ['10000', '25000', '50000', '100000', '250000', '500000'];
const MIN_AMOUNT = 500;
const PENDING_DONATION_STORAGE_KEY = 'agr.pendingDonation';

const MOBILE_MONEY_NETWORKS: Array<{
  helper: string;
  label: string;
  value: MobileMoneyNetwork;
}> = [
  {
    helper: 'For MTN Uganda mobile money numbers.',
    label: 'MTN MoMo',
    value: 'MTN',
  },
  {
    helper: 'For Airtel Money numbers in Uganda.',
    label: 'Airtel Money',
    value: 'Airtel',
  },
];

const METHOD_OPTIONS: Array<{
  description: string;
  helper: string;
  label: string;
  provider: string;
  value: DonationMethod;
}> = [
  {
    description: 'Use the phone number below to receive an MTN MoMo or Airtel Money prompt.',
    helper: 'Approval happens on your phone after you continue.',
    label: 'Mobile Money',
    provider: 'Flutterwave',
    value: 'mobile_money',
  },
  {
    description: 'Pay with Visa, Mastercard, or another supported card on MarzPay.',
    helper: 'Card details are entered on MarzPay after you continue.',
    label: 'Card',
    provider: 'MarzPay',
    value: 'card',
  },
];

function formatUgx(amount: string): string {
  const value = Number(amount);
  return Number.isFinite(value) && value > 0 ? `UGX ${value.toLocaleString()}` : 'Enter an amount';
}

function getSummaryNote(method: DonationMethod, network: MobileMoneyNetwork | ''): string {
  return method === 'mobile_money'
    ? network
      ? `We will use Flutterwave to send an approval request to your ${network} line.`
      : 'We will use Flutterwave to send a mobile money approval request to your phone.'
    : 'We will open MarzPay so you can complete the card payment there.';
}

function persistPendingCheckout(checkout: DonationApiResponse) {
  if (typeof window === 'undefined' || !checkout.provider) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      PENDING_DONATION_STORAGE_KEY,
      JSON.stringify({
        authorizationUrl: typeof checkout.authorizationUrl === 'string' ? checkout.authorizationUrl : null,
        provider: checkout.provider,
        reference: typeof checkout.reference === 'string' ? checkout.reference : null,
        status: typeof checkout.status === 'string' && checkout.status.trim() ? checkout.status.trim() : 'processing',
        transactionId: typeof checkout.transactionId === 'string' ? checkout.transactionId : null,
      })
    );
  } catch {
    // Ignore storage failures and continue with checkout.
  }
}

export default function DonationModal({ isOpen, onClose, eventId, eventTitle }: DonationModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [method, setMethod] = useState<DonationMethod>('mobile_money');
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState<MobileMoneyNetwork | ''>('');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const selectedMethod = METHOD_OPTIONS.find((option) => option.value === method) ?? METHOD_OPTIONS[0];
  const amountLabel = formatUgx(amount);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  const resetForm = () => {
    setMethod('mobile_money');
    setMobileMoneyNetwork('');
    setAmount('');
    setName('');
    setEmail('');
    setPhone('');
    setLoading(false);
    setError('');
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || loading) {
        return;
      }

      resetForm();
      onClose();
    };

    // iOS-safe scroll lock.
    // overflow:hidden on body does NOT stop scrolling on iOS Safari.
    // The correct approach is to record scrollY, switch body to
    // position:fixed (which freezes the page), then restore on close.
    const scrollY = window.scrollY;
    const prevStyle = document.body.getAttribute('style') || '';
    document.body.style.cssText = `position: fixed; width: 100%; top: -${scrollY}px; overflow-y: scroll;`;

    window.addEventListener('keydown', handleEscape);

    return () => {
      // Restore body and scroll position
      document.body.setAttribute('style', prevStyle);
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, loading, onClose]);

  const validate = () => {
    const parsedAmount = Number(amount);

    if (!amount.trim() || Number.isNaN(parsedAmount)) {
      return 'Enter a valid donation amount in UGX.';
    }

    if (parsedAmount < MIN_AMOUNT) {
      return `Minimum amount is UGX ${MIN_AMOUNT.toLocaleString()}.`;
    }

    if (!email.trim()) {
      return 'Email address is required so we can send a donation confirmation.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Enter a valid email address.';
    }

    if (method === 'mobile_money' && !phone.trim()) {
      return 'Enter the phone number that should receive the mobile money prompt.';
    }

    if (method === 'mobile_money' && !mobileMoneyNetwork) {
      return 'Select the mobile money network that should receive the prompt.';
    }

    return null;
  };

  const handleCheckout = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'UGX',
          email: email.trim() || undefined,
          method,
          mobileMoneyNetwork: method === 'mobile_money' ? mobileMoneyNetwork : undefined,
          name: name.trim() || undefined,
          phoneNumber: phone.trim() || undefined,
          eventId,
        }),
      });

      const data = (await response.json().catch(() => null)) as DonationApiResponse | null;
      if (!response.ok || !data?.redirectUrl) {
        setError(data?.error || 'Unable to start the secure checkout right now.');
        return;
      }

      persistPendingCheckout(data);
      window.location.assign(data.redirectUrl as string);
    } catch {
      setError('A network error occurred while starting checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleClose}>
      <section
        className={styles.modalCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.heroShell}>
          <div className={styles.heroPanel}>
            <span className={styles.kicker}>Donate in UGX</span>
            <h2 id={titleId} className={styles.modalTitle}>
              {eventTitle ? `Donate to ${eventTitle}` : 'Make a donation'}
            </h2>
            <p id={descriptionId} className={styles.modalSubtitle}>
              Choose how you want to give. Mobile money payments go through Flutterwave, card payments go
              through MarzPay, and we email a receipt after checkout.
            </p>
          </div>

          <div className={styles.providerRail}>
            <div className={styles.providerRailItem}>
              <span className={styles.providerRailLabel}>Mobile Money</span>
              <strong>Flutterwave</strong>
            </div>
            <div className={styles.providerRailItem}>
              <span className={styles.providerRailLabel}>Card Checkout</span>
              <strong>MarzPay</strong>
            </div>
          </div>

          <button type="button" className={styles.modalClose} onClick={handleClose} aria-label="Close donation modal">
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionLabel}>Payment method</span>
              <span className={styles.sectionHint}>You can switch routes before continuing.</span>
            </div>

            <div className={styles.methodGrid}>
              {METHOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.methodCard} ${method === option.value ? styles.methodCardActive : ''}`}
                  onClick={() => {
                    setMethod(option.value);
                    setError('');
                  }}
                >
                  <div className={styles.methodHeader}>
                    <strong className={styles.methodTitle}>{option.label}</strong>
                    <span className={styles.methodBadge}>{option.provider}</span>
                  </div>
                  <p className={styles.methodDescription}>{option.description}</p>
                  <span className={styles.methodHelper}>{option.helper}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionLabel}>Amount</span>
              <span className={styles.sectionHint}>All donations are collected in Ugandan shillings.</span>
            </div>

            <div className={styles.amountGrid}>
              {QUICK_AMOUNTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`${styles.amountChip} ${amount === item ? styles.amountChipActive : ''}`}
                  onClick={() => {
                    setAmount(item);
                    setError('');
                  }}
                >
                  UGX {Number(item).toLocaleString()}
                </button>
              ))}
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Donation Amount</span>
                <input
                  className={styles.input}
                  type="number"
                  min={String(MIN_AMOUNT)}
                  step="1"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 50,000"
                />
              </label>

              {method === 'mobile_money' ? (
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>
                    Mobile Network
                    <span className={styles.requiredMark}>Required</span>
                  </span>
                  <select
                    className={`${styles.input} ${styles.selectInput}`}
                    value={mobileMoneyNetwork}
                    onChange={(event) => {
                      setMobileMoneyNetwork(event.target.value as MobileMoneyNetwork | '');
                      setError('');
                    }}
                  >
                    <option value="">Select network</option>
                    {MOBILE_MONEY_NETWORKS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {mobileMoneyNetwork ? (
                    <span className={styles.fieldInfoText}>
                      {MOBILE_MONEY_NETWORKS.find((option) => option.value === mobileMoneyNetwork)?.helper}
                    </span>
                  ) : null}
                </label>
              ) : (
                <div className={`${styles.field} ${styles.fieldInfoCard}`}>
                  <span className={styles.fieldLabel}>Card Checkout</span>
                  <p className={styles.fieldInfoText}>You will enter your card details on MarzPay after you continue.</p>
                </div>
              )}

              {method === 'mobile_money' ? (
                <label className={`${styles.field} ${styles.fieldFullWidth}`}>
                  <span className={styles.fieldLabel}>
                    Phone Number
                    <span className={styles.requiredMark}>Required</span>
                  </span>
                  <input
                    className={styles.input}
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setError('');
                    }}
                    placeholder="+2567XXXXXXXX or 07XXXXXXXX"
                  />
                </label>
              ) : null}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionLabel}>Your details</span>
              <span className={styles.sectionHint}>We only use this for the receipt and donation follow-up.</span>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  Email Address
                  <span className={styles.requiredMark}>Required</span>
                </span>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError('');
                  }}
                  placeholder="name@example.com"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  Full Name
                  <span className={styles.optionalMark}>Optional</span>
                </span>
                <input
                  className={styles.input}
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError('');
                  }}
                  placeholder="Your name"
                />
              </label>
            </div>
          </div>

          <div className={styles.footerPanel}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Review</span>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryRow}>
                  <span>Method</span>
                  <strong>{selectedMethod.label}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Provider</span>
                  <strong>{selectedMethod.provider}</strong>
                </div>
                {method === 'mobile_money' ? (
                  <div className={styles.summaryRow}>
                    <span>Network</span>
                    <strong>{mobileMoneyNetwork || 'Select a network'}</strong>
                  </div>
                ) : null}
                <div className={styles.summaryRow}>
                  <span>Amount</span>
                  <strong>{amountLabel}</strong>
                </div>
                {eventTitle ? (
                  <div className={styles.summaryRow}>
                    <span>For</span>
                    <strong>{eventTitle}</strong>
                  </div>
                ) : null}
              </div>
              <p className={styles.summaryNote}>{getSummaryNote(method, mobileMoneyNetwork)}</p>
            </div>

            <div className={styles.trustCard}>
              <span className={styles.summaryLabel}>Before you continue</span>
              <ul className={styles.trustList}>
                <li>Your receipt goes to the email address you enter.</li>
                <li>All donations are charged in UGX.</li>
                <li>
                  {method === 'mobile_money'
                    ? 'Use the same phone number and network that are registered for the wallet you want to debit.'
                    : 'MarzPay handles the card checkout page.'}
                </li>
              </ul>
            </div>
          </div>

          {error ? <div className={styles.errorBox} role="alert">{error}</div> : null}

          <div className={styles.actionRow}>
            <button type="button" className={styles.secondaryButton} onClick={handleClose} disabled={loading}>
              Close
            </button>
            <button type="button" className={styles.primaryButton} onClick={handleCheckout} disabled={loading}>
              {loading
                ? 'Preparing Checkout...'
                : method === 'mobile_money'
                  ? 'Continue with Flutterwave'
                  : 'Continue with MarzPay'}
            </button>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}
