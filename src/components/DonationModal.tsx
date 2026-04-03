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

export default function DonationModal({ isOpen, onClose, eventId, eventTitle }: DonationModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [currency, setCurrency] = useState<DonationCurrency>('UGX');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const selectMethod = (method: PaymentMethod) => {
        setPaymentMethod(method);
        if (method === 'mobile_money_ug') {
            setCurrency('UGX');
            return;
        }
        setCurrency('USD');
    };

    const copyShareLink = async () => {
        const shareUrl = `${window.location.origin}/pay`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Payment link copied to clipboard.');
        } catch {
            prompt('Copy this payment link:', shareUrl);
        }
    };

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethod) {
            alert('Please choose a payment method first.');
            return;
        }

        const form = e.target as HTMLFormElement;
        const amount = form.amount.value;
        const email = form.email.value;
        const name = form.donorName.value;
        const phoneNumber = paymentMethod === 'mobile_money_ug' ? form.phoneNumber?.value : undefined;

        try {
            setLoading(true);
            const res = await fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, email, name, currency, phoneNumber, eventId, paymentMethod })
            });
            const data = await res.json();
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else if (data.paypalUrl) {
                window.location.href = data.paypalUrl;
            } else {
                alert(data.error || 'Payment initialization failed. Please try again later.');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred connecting to the payment gateway.");
            setLoading(false);
        }
    };

    const quickAmounts = currency === 'UGX' ? ['10000', '50000', '100000', '250000'] : ['5', '20', '50', '100'];

    const applyQuickAmount = (form: HTMLFormElement, amount: string) => {
        const amountInput = form.elements.namedItem('amount') as HTMLInputElement | null;
        if (amountInput) {
            amountInput.value = amount;
            amountInput.focus();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div>
                        <h2 className={styles.modalTitle}>{eventTitle ? `Donate to ${eventTitle}` : 'Make a Donation'}</h2>
                        <p className={styles.modalSubtitle}>Your investment transforms generations</p>
                    </div>
                    <button
                        type="button"
                        className={styles.modalClose}
                        onClick={onClose}
                        aria-label="Close donation modal"
                    >
                        ×
                    </button>
                </div>

                <div className={styles.formActions}>
                    <button type="button" onClick={copyShareLink} className={styles.btnCancel}>Copy Share Payment Link</button>
                </div>

                {!paymentMethod && (
                    <div className={styles.donateForm}>
                        <p className={styles.paymentHelp}>Choose how you want to pay first.</p>
                        <div className={styles.currencySelector}>
                            <label>
                                <input type="radio" name="paymentMethod" onChange={() => selectMethod('mobile_money_ug')} />
                                <span>Uganda Mobile Money (UGX)</span>
                            </label>
                            <label>
                                <input type="radio" name="paymentMethod" onChange={() => selectMethod('flutterwave_international')} />
                                <span>International Card/Transfer (Flutterwave)</span>
                            </label>
                            <label>
                                <input type="radio" name="paymentMethod" onChange={() => selectMethod('paypal')} />
                                <span>PayPal</span>
                            </label>
                        </div>
                    </div>
                )}

                {paymentMethod && (
                <form className={styles.donateForm} onSubmit={handleDonate}>
                    <div className={styles.formActions}>
                        <button type="button" onClick={() => setPaymentMethod(null)} className={styles.btnCancel} disabled={loading}>Change Payment Method</button>
                    </div>

                    <div className={styles.currencySelector}>
                        {paymentMethod === 'mobile_money_ug' && (
                            <label className={styles.active}>
                                <input type="radio" name="currency" value="UGX" checked readOnly />
                                <span>UGX (Mobile Money)</span>
                            </label>
                        )}
                        {paymentMethod !== 'mobile_money_ug' && (
                            <>
                                <label className={currency === 'USD' ? styles.active : ''}>
                                    <input
                                        type="radio"
                                        name="currency"
                                        value="USD"
                                        checked={currency === 'USD'}
                                        onChange={() => setCurrency('USD')}
                                    />
                                    <span>USD</span>
                                </label>
                                <label className={currency === 'EUR' ? styles.active : ''}>
                                    <input
                                        type="radio"
                                        name="currency"
                                        value="EUR"
                                        checked={currency === 'EUR'}
                                        onChange={() => setCurrency('EUR')}
                                    />
                                    <span>EUR</span>
                                </label>
                                <label className={currency === 'GBP' ? styles.active : ''}>
                                    <input
                                        type="radio"
                                        name="currency"
                                        value="GBP"
                                        checked={currency === 'GBP'}
                                        onChange={() => setCurrency('GBP')}
                                    />
                                    <span>GBP</span>
                                </label>
                            </>
                        )}
                    </div>

                    <div className={styles.quickAmounts}>
                        {quickAmounts.map((amt) => (
                            <button
                                key={amt}
                                type="button"
                                className={styles.quickAmountBtn}
                                onClick={(e) => applyQuickAmount((e.currentTarget.form as HTMLFormElement), amt)}
                            >
                                {currency} {Number(amt).toLocaleString()}
                            </button>
                        ))}
                    </div>

                    <input 
                        type="text" 
                        name="donorName" 
                        placeholder="Your Name" 
                        required 
                        className={styles.input}
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Your Email" 
                        required 
                        className={styles.input}
                    />
                    {paymentMethod === 'mobile_money_ug' && (
                        <input 
                            type="tel" 
                            name="phoneNumber" 
                            placeholder="Phone Number (e.g., 256703727965)" 
                            required 
                            pattern="[0-9]{10,15}" 
                            title="Enter a valid phone number with country code if needed" 
                            className={styles.input}
                        />
                    )}
                    <input 
                        type="number" 
                        name="amount" 
                        placeholder={`Amount (${currency})`} 
                        required 
                        min={paymentMethod === 'mobile_money_ug' ? '1000' : '5'} 
                        step="any" 
                        className={styles.input}
                    />

                    <p className={styles.paymentHelp}>
                        {paymentMethod === 'mobile_money_ug'
                            ? 'Mobile Money requires a reachable Ugandan phone number for payment confirmation.'
                            : paymentMethod === 'flutterwave_international'
                                ? 'International checkout uses Flutterwave first, with PayPal fallback if unavailable.'
                                : 'You will be redirected to PayPal secure checkout.'}
                    </p>

                    <div className={styles.formActions}>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className={styles.btnCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={styles.btnSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    );
}
