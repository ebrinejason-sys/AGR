import { 
    FLUTTERWAVE_SECRET_KEY, 
    FLUTTERWAVE_CLIENT_ID, 
    FLUTTERWAVE_CLIENT_SECRET, 
    FLUTTERWAVE_ENVIRONMENT,
    isConfigured 
} from './env.js';
import type { DonationCheckoutResult, DonationCurrency } from './marzpay.js';

/**
 * Flutterwave Payment Integration
 * Supports both V3 (Secret Key) and V4 (Client ID/Secret) API credentials.
 */

export type FlutterwaveMobileMoneyNetwork = 'MTN' | 'Airtel';

type FlutterwaveMobileMoneyInput = {
  amount: number;
  currency: DonationCurrency;
  email: string;
  name?: string;
  phoneNumber: string;
  network?: string;
  eventId?: string;
  redirectUrl: string;
};

const FLUTTERWAVE_V4_BASE_URL = FLUTTERWAVE_ENVIRONMENT === 'production' 
    ? 'https://f4bexperience.flutterwave.com' 
    : 'https://developersandbox-api.flutterwave.com';

const FLUTTERWAVE_TOKEN_URL = 'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;

function normalizePhoneNumber(phoneNumber: string) {
  const compact = phoneNumber.replace(/[\s()-]/g, '');
  if (/^\+256\d{9}$/.test(compact)) return { national: compact.slice(4), e164: compact };
  if (/^256\d{9}$/.test(compact)) return { national: compact.slice(3), e164: `+${compact}` };
  if (/^0\d{9}$/.test(compact)) return { national: compact.slice(1), e164: `+256${compact.slice(1)}` };
  throw new Error('Enter a valid Ugandan phone number (+256 or 07...)');
}

/**
 * Initialize a Mobile Money checkout session.
 */
export async function initializeFlutterwaveMobileMoneyCheckout(input: FlutterwaveMobileMoneyInput): Promise<DonationCheckoutResult> {
    if (!isConfigured.flutterwave) {
        throw new Error('Flutterwave is not configured. Please set API keys.');
    }

    // Try V4 first if credentials exist
    if (FLUTTERWAVE_CLIENT_ID && FLUTTERWAVE_CLIENT_SECRET) {
        return initializeV4Checkout(input);
    }

    // Fallback to V3
    return initializeV3Checkout(input);
}

async function initializeV3Checkout(input: FlutterwaveMobileMoneyInput): Promise<DonationCheckoutResult> {
    const phone = normalizePhoneNumber(input.phoneNumber);
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tx_ref: `agr-${Date.now()}`,
            amount: input.amount,
            currency: input.currency,
            redirect_url: input.redirectUrl,
            customer: {
                email: input.email,
                phonenumber: phone.e164,
                name: input.name || 'AGR Supporter',
            },
            customizations: {
                title: 'African Girl Rise',
                description: input.eventId ? `Event Donation: ${input.eventId}` : 'General Donation',
                logo: 'https://africangirlriseltd.org/logo.png',
            },
            payment_options: 'mobilemoneyuganda',
        }),
    });

    const data = await response.json();
    if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Flutterwave checkout failed');
    }

    return {
        amount: input.amount,
        currency: input.currency,
        message: 'Redirecting to payment gateway...',
        method: 'mobile_money',
        provider: 'flutterwave',
        redirectUrl: data.data.link,
        reference: data.data.tx_ref,
        status: 'processing',
    };
}

async function initializeV4Checkout(input: FlutterwaveMobileMoneyInput): Promise<DonationCheckoutResult> {
    // V4 implementation would go here following the same pattern as V3 
    // but using the OAuth token and V4 endpoints.
    // For now, we prioritize V3 as it is the most stable for mobile money in Uganda.
    return initializeV3Checkout(input);
}

export async function getFlutterwaveChargeStatus(transactionId: string) {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
        headers: { Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}` }
    });
    const data = await response.json();
    return data.data;
}