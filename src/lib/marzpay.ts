import {
    MARZPAY_API_KEY,
    MARZPAY_API_SECRET,
    MARZPAY_BASIC_AUTH_TOKEN,
    MARZPAY_SECRET_KEY,
    isConfigured,
} from './env.js';

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

function getMarzPayAuthorizationHeader(): string {
    if (MARZPAY_BASIC_AUTH_TOKEN) {
        return `Basic ${MARZPAY_BASIC_AUTH_TOKEN}`;
    }

    if (MARZPAY_API_KEY && (MARZPAY_API_SECRET || MARZPAY_SECRET_KEY)) {
        const secret = MARZPAY_API_SECRET || MARZPAY_SECRET_KEY;
        const credentials = Buffer.from(`${MARZPAY_API_KEY}:${secret}`).toString('base64');
        return `Basic ${credentials}`;
    }

    // Backward compatibility for setups using a bearer secret directly.
    return `Bearer ${MARZPAY_SECRET_KEY}`;
}

/**
 * MarzPay Payment Integration
 * Primarily used for Card payments in Uganda.
 */

export async function initializeMarzPayCheckout(input: MarzPayCheckoutInput): Promise<DonationCheckoutResult> {
    if (!isConfigured.marzpay) {
        throw new Error('MarzPay is not configured. Please set API keys.');
    }

    const reference = crypto.randomUUID();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let response: Response;
    try {
        response = await fetch(`${MARZPAY_BASE_URL}/collect-money`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getMarzPayAuthorizationHeader(),
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                amount: input.amount,
                currency: input.currency,
                reference,
                redirect_url: input.callbackUrl,
                callback_url: input.callbackUrl,
                description: input.eventId ? `AGR Event: ${input.eventId}` : 'AGR Donation',
                method: 'card',
                payment_method: 'card',
                country: 'UG',
                email: input.email,
                customer_name: input.name,
                name: input.name,
            }),
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeout);
    }

    const rawText = await response.text();
    let data: Record<string, unknown>;
    try {
        data = JSON.parse(rawText);
    } catch {
        throw new Error(`MarzPay returned non-JSON (HTTP ${response.status}): ${rawText.slice(0, 200)}`);
    }
    if (!response.ok) {
        const detail = JSON.stringify(data);
        console.error(`MarzPay checkout failed (HTTP ${response.status}):`, detail);
        const validationErrors = data.errors ? ` Errors: ${JSON.stringify(data.errors)}` : '';
        throw new Error((data.message as string) || `MarzPay checkout failed (HTTP ${response.status})${validationErrors}`);
    }

    return {
        amount: input.amount,
        currency: 'UGX',
        message: 'Redirecting to secure card payment...',
        method: 'card',
        provider: 'marzpay',
        redirectUrl: (data.data as Record<string, unknown>)?.redirect_url as string || data.redirect_url as string,
        reference,
        status: 'processing',
        transactionId: (data.data as Record<string, unknown>)?.id as string || data.id as string,
    };
}

export async function getMarzPayCollectionStatus(transactionId: string) {
    const response = await fetch(`${MARZPAY_BASE_URL}/collect-money/${transactionId}`, {
        headers: { 'Authorization': getMarzPayAuthorizationHeader() }
    });
    const rawText = await response.text();
    let data: Record<string, unknown>;
    try {
        data = JSON.parse(rawText);
    } catch {
        throw new Error(`MarzPay status returned non-JSON (HTTP ${response.status}): ${rawText.slice(0, 200)}`);
    }
    return (data.data as Record<string, unknown>) || data;
}
