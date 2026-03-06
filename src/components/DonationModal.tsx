"use client";

import { useState } from 'react';
import styles from './DonationModal.module.css';

type DonationModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
    const [currency, setCurrency] = useState<'UGX' | 'USD'>('UGX');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const amount = form.amount.value;
        const email = form.email.value;
        const name = form.donorName.value;
        const phoneNumber = currency === 'UGX' ? form.phoneNumber?.value : undefined;

        try {
            setLoading(true);
            const res = await fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, email, name, currency, phoneNumber })
            });
            const data = await res.json();
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
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
                        <h2 className={styles.modalTitle}>Make a Donation</h2>
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

                <form className={styles.donateForm} onSubmit={handleDonate}>
                    <div className={styles.currencySelector}>
                        <label className={currency === 'UGX' ? styles.active : ''}>
                            <input
                                type="radio"
                                name="currency"
                                value="UGX"
                                checked={currency === 'UGX'}
                                onChange={() => setCurrency('UGX')}
                            />
                            <span>🇺🇬 UGX (Mobile Money)</span>
                        </label>
                        <label className={currency === 'USD' ? styles.active : ''}>
                            <input
                                type="radio"
                                name="currency"
                                value="USD"
                                checked={currency === 'USD'}
                                onChange={() => setCurrency('USD')}
                            />
                            <span>💳 USD (International Card)</span>
                        </label>
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
                    {currency === 'UGX' && (
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
                        min={currency === 'UGX' ? '1000' : '5'} 
                        step="any" 
                        className={styles.input}
                    />

                    <p className={styles.paymentHelp}>
                        {currency === 'UGX'
                            ? '🇺🇬 Mobile Money requires a reachable Ugandan phone number for payment confirmation.'
                            : '💳 International card payments are processed securely via Flutterwave. Note: USD payments may require additional account verification.'}
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
            </div>
        </div>
    );
}
