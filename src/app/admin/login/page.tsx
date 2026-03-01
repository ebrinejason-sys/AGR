"use client";

import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import styles from './login.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'request_otp', email, password })
            });
            const data = await res.json();

            if (res.ok) {
                setSuccessMsg('OTP sent to your email.');
                setStep('otp');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
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
                body: JSON.stringify({ action: 'verify_otp', email, otp })
            });
            const data = await res.json();

            if (res.ok) {
                // In a real app, you'd set a secure HTTP-Only cookie here to maintain the session
                document.cookie = "admin_session=authenticated; path=/; max-age=86400";
                router.push('/admin');
            } else {
                setError(data.error || 'Invalid OTP');
            }
        } catch (err) {
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
                                    placeholder="africangirlriseltd@gmail.com"
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
                                    placeholder="••••••••"
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
                                onChange={e => setOtp(e.target.value)}
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
