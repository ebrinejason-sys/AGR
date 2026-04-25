"use client";

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, CreditCard, Smartphone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
  icon: typeof CreditCard;
}> = [
  {
    description: 'Use your phone number to receive an MTN MoMo or Airtel Money prompt.',
    helper: 'Approval happens on your phone after you continue.',
    label: 'Mobile Money',
    provider: 'Flutterwave',
    value: 'mobile_money',
    icon: Smartphone,
  },
  {
    description: 'Pay securely with Visa, Mastercard, or other cards via MarzPay.',
    helper: 'Card details are entered on MarzPay after you continue.',
    label: 'Card Payment',
    provider: 'MarzPay',
    value: 'card',
    icon: CreditCard,
  },
];

function formatUgx(amount: string): string {
  const value = Number(amount);
  return Number.isFinite(value) && value > 0 ? `UGX ${value.toLocaleString()}` : 'Enter an amount';
}

function persistPendingCheckout(checkout: DonationApiResponse) {
  if (typeof window === 'undefined' || !checkout.provider) return;
  try {
    window.sessionStorage.setItem(
      PENDING_DONATION_STORAGE_KEY,
      JSON.stringify({
        authorizationUrl: checkout.authorizationUrl || null,
        provider: checkout.provider,
        reference: checkout.reference || null,
        status: checkout.status || 'processing',
        transactionId: checkout.transactionId || null,
      })
    );
  } catch (e) {
    console.warn('Failed to persist checkout state', e);
  }
}

export default function DonationModal({ isOpen, onClose, eventId, eventTitle }: DonationModalProps) {
  const [method, setMethod] = useState<DonationMethod>('mobile_money');
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState<MobileMoneyNetwork | ''>('');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const selectedMethod = METHOD_OPTIONS.find((o) => o.value === method) ?? METHOD_OPTIONS[0];

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.cssText = `position: fixed; width: 100%; top: -${scrollY}px; overflow-y: scroll;`;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const validate = () => {
    const val = Number(amount);
    if (!amount.trim() || Number.isNaN(val)) return 'Please enter a valid donation amount.';
    if (val < MIN_AMOUNT) return `The minimum donation is UGX ${MIN_AMOUNT.toLocaleString()}.`;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address for your receipt.';
    if (method === 'mobile_money') {
      if (!phone.trim()) return 'Please enter your phone number for the prompt.';
      if (!mobileMoneyNetwork) return 'Please select your mobile money network.';
    }
    return null;
  };

  const handleCheckout = async () => {
    const vError = validate();
    if (vError) {
      setError(vError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, email, method, mobileMoneyNetwork, name, phoneNumber: phone, eventId }),
      });

      const data = await res.json().catch(() => ({ error: 'Invalid server response' }));
      if (!res.ok || !data.redirectUrl) {
        setError(data.error || 'Checkout initiation failed. Please try again.');
        return;
      }

      persistPendingCheckout(data);
      window.location.assign(data.redirectUrl);
    } catch (e) {
      setError('A network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalBackdrop}
            onClick={onClose}
          />

          <motion.section
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.heroShell}>
              <div className={styles.heroPanel}>
                <span className={styles.kicker}>Support Her Rise</span>
                <h2 className={styles.modalTitle}>
                  {eventTitle ? `Support ${eventTitle}` : 'Make a Difference'}
                </h2>
                <p className={styles.modalSubtitle}>
                  Your contribution directly funds education, safety, and recovery for girls in Uganda.
                </p>
              </div>
              <button className={styles.modalClose} onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Method Selection */}
              <div className={styles.section}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionLabel}>Select Payment Method</span>
                </div>
                <div className={styles.methodGrid}>
                  {METHOD_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.methodCard} ${method === opt.value ? styles.methodCardActive : ''}`}
                      onClick={() => { setMethod(opt.value); setError(''); }}
                    >
                      <div className={styles.methodHeader}>
                        <opt.icon size={20} className={method === opt.value ? styles.activeIcon : ''} />
                        <span className={styles.methodBadge}>{opt.provider}</span>
                      </div>
                      <strong className={styles.methodTitle}>{opt.label}</strong>
                      <p className={styles.methodDescription}>{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div className={styles.section}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionLabel}>Donation Amount (UGX)</span>
                  <span className={styles.sectionHint}>Minimum: UGX 500</span>
                </div>
                <div className={styles.amountGrid}>
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      className={`${styles.amountChip} ${amount === amt ? styles.amountChipActive : ''}`}
                      onClick={() => { setAmount(amt); setError(''); }}
                    >
                      {Number(amt).toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    className={styles.input}
                    type="number"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setError(''); }}
                    placeholder="Enter custom amount"
                  />
                  <div className={styles.inputAffix}>UGX</div>
                </div>
              </div>

              {/* Details Form */}
              <div className={styles.section}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionLabel}>Your Information</span>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Email Address</label>
                    <input
                      className={styles.input}
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="receipt@example.com"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Full Name (Optional)</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                {method === 'mobile_money' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={styles.fieldRow}
                  >
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Network</label>
                      <select
                        className={`${styles.input} ${styles.selectInput}`}
                        value={mobileMoneyNetwork}
                        onChange={(e) => setMobileMoneyNetwork(e.target.value as MobileMoneyNetwork)}
                      >
                        <option value="">Select Network</option>
                        {MOBILE_MONEY_NETWORKS.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Phone Number</label>
                      <input
                        className={styles.input}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XXXXXXXX"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.errorBox}
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className={styles.actionRow}>
                <button className={styles.secondaryButton} onClick={onClose} disabled={loading}>Cancel</button>
                <button className={styles.primaryButton} onClick={handleCheckout} disabled={loading}>
                  {loading ? (
                    <><Loader2 className={styles.spinner} size={18} /> Preparing Checkout...</>
                  ) : (
                    <><Heart size={18} /> {method === 'mobile_money' ? 'Pay with Mobile Money' : 'Pay with Card'}</>
                  )}
                </button>
              </div>

              <div className={styles.secureBadge}>
                <CheckCircle2 size={14} />
                <span>Secure payment powered by {selectedMethod.provider}</span>
              </div>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
