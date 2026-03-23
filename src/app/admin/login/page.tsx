"use client";

import { useEffect, useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import styles from './login.module.css';
import Image from 'next/image';

export default function AdminLogin() {
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        fetch('/api/auth', { cache: 'no-store', credentials: 'same-origin' })
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated) {
                    window.location.replace('/admin');
                    return;
                }

                if (!data.resendConfigured) {
                    setNotice('RESEND_API_KEY is not configured. OTP delivery will fail until it is set.');
                }
            })
            .catch(() => undefined);
    }, []);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.replace(/\D/g, '').slice(0, 6);

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ action: 'request_otp', email: normalizedEmail, password })
            });
            const data = await res.json();

            if (res.ok) {
                setEmail(normalizedEmail);
                setSuccessMsg('OTP sent to your email.');
                setStep('otp');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ action: 'verify_otp', email: normalizedEmail, otp: normalizedOtp })
            });
            const data = await res.json();

            if (res.ok) {
                setSuccessMsg('Sign-in successful. Redirecting to the dashboard...');
                window.location.assign('/admin');
            } else {
                setError(data.error || 'Invalid OTP');
            }
        } catch {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.logoBox}>
                    <Image src="/logo.png" alt="African Girl Rise" width={80} height={80} className={styles.logo} />
                </div>

                <div className={styles.header}>
                    <h1>Admin Portal</h1>
                    <p>{step === 'credentials' ? 'Sign in to manage the African Girl Rise platform.' : 'Enter the 6-digit code sent to your email.'}</p>
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}
                {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
                {notice && <div className={styles.successMsg}>{notice}</div>}

                {step === 'credentials' ? (
                    <form onSubmit={handleRequestOtp} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <div className={styles.passwordWrapper}>
                                <Mail size={18} className={styles.lockIcon} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <div className={styles.passwordWrapper}>
                                <Lock size={18} className={styles.lockIcon} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.loginBtn} disabled={loading}>
                            {loading ? 'Verifying...' : 'Continue'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>One-Time Password (OTP)</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className={styles.otpInput}
                            />
                        </div>

                        <div className={styles.btnGroup}>
                            <button type="button" className={styles.cancelBtn} onClick={() => { setStep('credentials'); setOtp(''); }}>
                                Back
                            </button>
                            <button type="submit" className={styles.loginBtn} disabled={loading}>
                                {loading ? 'Logging in...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
