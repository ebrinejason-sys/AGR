"use client";

import { useState } from 'react';
import styles from './DonationModal.module.css';

type DonationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    eventId?: string;
    eventTitle?: string;
};

type DonationCurrency = 'UGX' | 'USD' | 'EUR' | 'GBP';
type PaymentMethod = 'mobile_money_ug' | 'flutterwave_international' | 'paypal';

const METHODS: { id: PaymentMethod; icon: string; name: string; desc: string }[] = [
    { id: 'mobile_money_ug',          icon: '📱', name: 'Uganda Mobile Money',           desc: 'MTN MoMo / Airtel Money (UGX)' },
    { id: 'flutterwave_international', icon: '💳', name: 'International Card / Transfer', desc: 'Visa, Mastercard, Bank Transfer' },
    { id: 'paypal',                   icon: '🅿️', name: 'PayPal',                        desc: 'Secure PayPal checkout' },
];

const STEP_LABELS = ['Method', 'Amount', 'Confirm'];

export default function DonationModal({ isOpen, onClose, eventId, eventTitle }: DonationModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [currency, setCurrency]           = useState<DonationCurrency>('UGX');
    const [amount, setAmount]               = useState('');
    const [name, setName]                   = useState('');
    const [email, setEmail]                 = useState('');
    const [phone, setPhone]                 = useState('');
    const [loading, setLoading]             = useState(false);

    if (!isOpen) return null;

    const quickAmounts = currency === 'UGX'
        ? [{ label: '10,000', val: '10000' }, { label: '50,000', val: '50000' }, { label: '100,000', val: '100000' }, { label: '250,000', val: '250000' }]
        : [{ label: '$5',     val: '5'     }, { label: '$20',    val: '20'    }, { label: '$50',     val: '50'    }, { label: '$100',    val: '100'   }];

    const infoMap: Record<PaymentMethod, string> = {
        mobile_money_ug:           "You'll receive a prompt on your Ugandan phone number to confirm payment.",
        flutterwave_international: "You'll be redirected to Flutterwave's secure checkout page.",
        paypal:                    "You'll be redirected to PayPal's secure checkout page.",
    };

    const selectMethod = (m: PaymentMethod) => {
        setPaymentMethod(m);
        setCurrency(m === 'mobile_money_ug' ? 'UGX' : 'USD');
        setStep(2);
    };

    const goToConfirm = () => {
        if (!amount || Number(amount) <= 0) { alert('Please enter a valid amount.'); return; }
        if (!name.trim())  { alert('Please enter your name.'); return; }
        if (!email.trim()) { alert('Please enter your email.'); return; }
        if (paymentMethod === 'mobile_money_ug' && !phone.trim()) { alert('Please enter your phone number.'); return; }
        setStep(3);
    };

    const handleDonate = async () => {
        if (!paymentMethod) return;
        try {
            setLoading(true);
            const res = await fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, email, name, currency, phoneNumber: phone || undefined, eventId, paymentMethod }),
            });
            const data = await res.json();
            if (data.paymentUrl)  { window.location.href = data.paymentUrl;  return; }
            if (data.paypalUrl)   { window.location.href = data.paypalUrl;   return; }
            alert(data.error || 'Payment initialization failed. Please try again.');
        } catch {
            alert('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = async () => {
        const url = `${window.location.origin}/pay`;
        try { await navigator.clipboard.writeText(url); alert('Payment link copied!'); }
        catch { prompt('Copy this link:', url); }
    };

    const handleClose = () => { setStep(1); setPaymentMethod(null); setAmount(''); setName(''); setEmail(''); setPhone(''); onClose(); };

    const currencyOptions: DonationCurrency[] = ['USD', 'EUR', 'GBP'];

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>

                {/* Banner */}
                <div className={styles.modalBanner}>
                    <div className={styles.modalBannerTop}>
                        <div>
                            <h2 className={styles.modalTitle}>{eventTitle ? `Donate — ${eventTitle}` : 'Make a Donation'}</h2>
                            <p className={styles.modalSubtitle}>Every contribution transforms a girl&apos;s future</p>
                        </div>
                        <button className={styles.modalClose} onClick={handleClose} aria-label="Close">×</button>
                    </div>

                    {/* Step dots */}
                    <div className={styles.stepBar}>
                        {STEP_LABELS.map((_, i) => (
                            <div key={i} className={`${styles.stepDot} ${step > i ? styles.active : ''}`} />
                        ))}
                    </div>
                    <p className={styles.stepLabel}>Step {step} of 3 — {STEP_LABELS[step - 1]}</p>
                </div>

                {/* Body */}
                <div className={styles.modalBody}>

                    {/* ─── Step 1: Choose method ─── */}
                    {step === 1 && (
                        <>
                            <span className={styles.sectionLabel}>Choose payment method</span>
                            <div className={styles.methodGrid}>
                                {METHODS.map((m) => (
                                    <button key={m.id} className={styles.methodCard} onClick={() => selectMethod(m.id)}>
                                        <span className={styles.methodIcon}>{m.icon}</span>
                                        <span className={styles.methodInfo}>
                                            <span className={styles.methodName}>{m.name}</span>
                                            <span className={styles.methodDesc}>{m.desc}</span>
                                        </span>
                                        <span className={styles.methodArrow}>›</span>
                                    </button>
                                ))}
                            </div>

                            <div className={styles.shareRow}>
                                <button className={styles.shareLink} onClick={copyLink}>📋 Copy shareable payment link</button>
                            </div>

                            <button className={styles.btnCancel} onClick={handleClose}>Cancel</button>
                        </>
                    )}

                    {/* ─── Step 2: Amount + details ─── */}
                    {step === 2 && paymentMethod && (
                        <>
                            {/* Currency tabs (not for mobile money) */}
                            {paymentMethod !== 'mobile_money_ug' && (
                                <>
                                    <span className={styles.sectionLabel}>Currency</span>
                                    <div className={styles.currencyTabs}>
                                        {currencyOptions.map((c) => (
                                            <button
                                                key={c}
                                                className={`${styles.currencyTab} ${currency === c ? styles.activeTab : ''}`}
                                                onClick={() => setCurrency(c)}
                                            >{c}</button>
                                        ))}
                                    </div>
                                </>
                            )}

                            <span className={styles.sectionLabel}>Quick amounts</span>
                            <div className={styles.quickAmounts}>
                                {quickAmounts.map((q) => (
                                    <button
                                        key={q.val}
                                        className={`${styles.quickAmountBtn} ${amount === q.val ? styles.selectedAmt : ''}`}
                                        onClick={() => setAmount(q.val)}
                                    >{q.label}</button>
                                ))}
                            </div>

                            <span className={styles.sectionLabel}>Or enter amount ({currency})</span>
                            <input
                                className={styles.input}
                                type="number"
                                placeholder={currency === 'UGX' ? 'e.g. 50000' : 'e.g. 25'}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min={currency === 'UGX' ? '1000' : '1'}
                                step="any"
                            />

                            <span className={styles.sectionLabel}>Your details</span>
                            <input className={styles.input} type="text"  placeholder="Full Name"  value={name}  onChange={(e) => setName(e.target.value)}  required />
                            <input className={styles.input} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            {paymentMethod === 'mobile_money_ug' && (
                                <input className={styles.input} type="tel" placeholder="Phone (e.g. 256703727965)" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            )}

                            <p className={styles.infoNote}>{infoMap[paymentMethod]}</p>

                            <div className={styles.btnRow}>
                                <button className={styles.btnBack} onClick={() => setStep(1)}>← Back</button>
                                <button className={styles.btnSubmit} onClick={goToConfirm}>Review Donation →</button>
                            </div>
                            <button className={styles.btnCancel} onClick={handleClose}>Cancel</button>
                        </>
                    )}

                    {/* ─── Step 3: Confirm ─── */}
                    {step === 3 && paymentMethod && (
                        <>
                            <span className={styles.sectionLabel}>Confirm your donation</span>
                            <div className={styles.summaryBox}>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Method</span>
                                    <span className={styles.summaryValue}>{METHODS.find(m => m.id === paymentMethod)?.name}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Name</span>
                                    <span className={styles.summaryValue}>{name}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Email</span>
                                    <span className={styles.summaryValue}>{email}</span>
                                </div>
                                {phone && (
                                    <div className={styles.summaryRow}>
                                        <span className={styles.summaryLabel}>Phone</span>
                                        <span className={styles.summaryValue}>{phone}</span>
                                    </div>
                                )}
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Amount</span>
                                    <span className={`${styles.summaryValue} ${styles.summaryTotal}`}>{currency} {Number(amount).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className={styles.btnRow}>
                                <button className={styles.btnBack} onClick={() => setStep(2)} disabled={loading}>← Edit</button>
                                <button className={styles.btnSubmit} onClick={handleDonate} disabled={loading}>
                                    {loading ? 'Processing…' : '💝 Donate Now'}
                                </button>
                            </div>
                            <button className={styles.btnCancel} onClick={handleClose} disabled={loading}>Cancel</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

