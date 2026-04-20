import { MARZPAY_SECRET_KEY, MARZPAY_ENVIRONMENT, isConfigured } from './env';

export type DonationCurrency = 'UGX';
export type DonationMethod = 'mobile_money' | 'card';
export type DonationProvider = 'flutterwave' | 'marzpay';

export type DonationCheckoutResult = {
  amount: number;
  authorizationUrl?: string;
  currency: DonationCurrency;
  method: DonationMethod;
  message: string;
  provider: DonationProvider;
  redirectUrl: string;
  reference: string;
  status?: string;
  transactionId?: string;
};

type MarzPayCheckoutInput = {
  amount: number;
  currency: DonationCurrency;
  email?: string;
  name?: string;
  eventId?: string;
  callbackUrl: string;
};

const MARZPAY_BASE_URL = 'https://wallet.wearemarz.com/api/v1';

/**
 * MarzPay Payment Integration
 * Primarily used for Card payments in Uganda.
 */

export async function initializeMarzPayCheckout(input: MarzPayCheckoutInput): Promise<DonationCheckoutResult> {
    if (!isConfigured.marzpay) {
        throw new Error('MarzPay is not configured. Please set API keys.');
    }

    const reference = `agr-mz-${Date.now()}`;
    const response = await fetch(`${MARZPAY_BASE_URL}/collect-money`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MARZPAY_SECRET_KEY}`,
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            amount: input.amount,
            currency: input.currency,
            reference,
            callback_url: input.callbackUrl,
            description: input.eventId ? `AGR Event: ${input.eventId}` : 'AGR Donation',
            method: 'card', // Specifically for cards
            country: 'UG',
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'MarzPay checkout failed');
    }

    return {
        amount: input.amount,
        currency: 'UGX',
        message: 'Redirecting to secure card payment...',
        method: 'card',
        provider: 'marzpay',
        redirectUrl: data.data?.redirect_url || data.redirect_url,
        reference,
        status: 'processing',
        transactionId: data.data?.id || data.id,
    };
}

export async function getMarzPayCollectionStatus(transactionId: string) {
    const response = await fetch(`${MARZPAY_BASE_URL}/collect-money/${transactionId}`, {
        headers: { 'Authorization': `Bearer ${MARZPAY_SECRET_KEY}` }
    });
    const data = await response.json();
    return data.data || data;
}
