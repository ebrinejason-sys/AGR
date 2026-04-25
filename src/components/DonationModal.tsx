import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import styles from './DonationModal.module.css';

type DonationMethod = 'mobile_money' | 'card';
type MobileMoneyNetwork = 'MTN' | 'Airtel';

type DonationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventTitle?: string;
};

const MIN_AMOUNT = 500;
const QUICK_AMOUNTS = ['5000', '10000', '25000', '50000', '100000', '250000'];

const METHOD_OPTIONS = [
  {
    value: 'mobile_money' as const,
    label: 'Mobile Money',
    provider: 'Flutterwave',
    description: 'MTN & Airtel Uganda',
    helper: 'Direct wallet charge via secure gateway.',
    icon: Smartphone,
  },
  {
    value: 'card' as const,
    label: 'Debit/Credit Card',
    provider: 'MarzPay',
    description: 'Visa & Mastercard',
    helper: 'International & local card payments.',
    icon: CreditCard,
  },
];

const MOBILE_MONEY_NETWORKS = [
  { value: 'MTN' as const, label: 'MTN Uganda', helper: '*165# menu' },
  { value: 'Airtel' as const, label: 'Airtel Uganda', helper: '*185# menu' },
];

export default function DonationModal({ isOpen, onClose, eventId, eventTitle }: DonationModalProps) {
  const [method, setMethod] = useState<DonationMethod>('mobile_money');
  const [amount, setAmount] = useState('50000');
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState<MobileMoneyNetwork | ''>('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [loading, onClose]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setError('');
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount < MIN_AMOUNT) {
      setError(`Minimum donation is UGX ${MIN_AMOUNT.toLocaleString()}.`);
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (method === 'mobile_money') {
      if (!mobileMoneyNetwork) {
        setError('Please select your mobile money network.');
        return;
      }
      if (!phone || phone.length < 10) {
        setError('Please enter a valid phone number.');
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          method,
          email,
          name,
          phoneNumber: phone,
          mobileMoneyNetwork,
          eventId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout.');
      }

      if (data.redirectUrl) {
        window.location.assign(data.redirectUrl);
      } else {
        throw new Error('No redirect URL provided by payment gateway.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const amountLabel = `UGX ${Number(amount || 0).toLocaleString()}`;

  return createPortal(
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <section className={styles.modalCard} role="dialog" aria-modal="true">
        <div className={styles.heroShell}>
          <div className={styles.heroPanel}>
            <span className={styles.kicker}>Secure Donation</span>
            <h2 className={styles.modalTitle}>
              {eventTitle ? `Support ${eventTitle}` : 'Support Her Rise'}
            </h2>
            <p className={styles.modalSubtitle}>
              Your contribution goes directly to keeping girls safe and in school.
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

          <button type="button" className={styles.modalClose} onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionLabel}>Payment method</span>
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
                  disabled={loading}
                >
                  <div className={styles.methodHeader}>
                    <strong className={styles.methodTitle}>{option.label}</strong>
                    <option.icon size={18} className={method === option.value ? 'text-gradient' : ''} />
                  </div>
                  <p className={styles.methodDescription}>{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionLabel}>Amount</span>
              <span className={styles.sectionHint}>Donations are in UGX.</span>
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
                  disabled={loading}
                >
                  {Number(item).toLocaleString()}
                </button>
              ))}
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Custom Amount</span>
                <input
                  className={styles.input}
                  type="number"
                  min={MIN_AMOUNT}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 50,000"
                  disabled={loading}
                />
              </label>

              {method === 'mobile_money' ? (
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Network</span>
                  <select
                    className={`${styles.input} ${styles.selectInput}`}
                    value={mobileMoneyNetwork}
                    onChange={(e) => setMobileMoneyNetwork(e.target.value as MobileMoneyNetwork)}
                    disabled={loading}
                  >
                    <option value="">Select network</option>
                    {MOBILE_MONEY_NETWORKS.map((n) => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <div className={styles.fieldInfoCard}>
                  <span className={styles.fieldLabel}>Secure Card Gateway</span>
                  <p className={styles.fieldInfoText}>Processed securely by MarzPay.</p>
                </div>
              )}

              {method === 'mobile_money' && (
                <label className={`${styles.field} ${styles.fieldFullWidth}`}>
                  <span className={styles.fieldLabel}>Phone Number</span>
                  <input
                    className={styles.input}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    disabled={loading}
                  />
                </label>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email Address</span>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Full Name (Optional)</span>
                <input
                  className={styles.input}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Grace Akatwijuka"
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} />
                  Processing...
                </>
              ) : (
                `Donate ${amountLabel}`
              )}
            </button>
          </div>

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} /> Secure Encryption & Data Protection
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}
