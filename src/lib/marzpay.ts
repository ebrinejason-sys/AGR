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

export type MarzPayCollectionStatus = {
  amount: number;
  currency: DonationCurrency;
  description: string | null;
  phoneNumber: string | null;
  provider: 'marzpay';
  providerName: string | null;
  reference: string;
  status: string;
  transactionId: string;
};

type MarzPayApiResult = {
  data?: unknown;
  errors?: Record<string, string[] | string>;
  message?: string;
  status?: string;
};

const REDIRECT_URL_PATHS = [
  ['redirect_url'],
  ['redirectUrl'],
  ['url'],
  ['link'],
  ['data', 'redirect_url'],
  ['data', 'redirectUrl'],
  ['data', 'url'],
  ['data', 'link'],
] as const;

function getNestedValue(source: unknown, path: readonly string[]): unknown {
  let current: unknown = source;

  for (const segment of path) {
    if (!current || typeof current !== 'object' || !(segment in current)) {
      return null;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function extractString(source: unknown, path: readonly string[]): string | null {
  const value = getNestedValue(source, path);
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  return null;
}

function extractNumber(source: unknown, path: readonly string[]): number | null {
  const value = getNestedValue(source, path);
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function extractRedirectUrl(source: unknown): string | null {
  for (const path of REDIRECT_URL_PATHS) {
    const value = getNestedValue(source, path);
    if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
      return value;
    }
  }

  return null;
}

function normalizeStatus(status: string | null | undefined): string {
  const value = status?.trim().toLowerCase();

  switch (value) {
    case 'success':
    case 'successful':
    case 'completed':
      return 'completed';
    case 'failed':
    case 'error':
      return 'failed';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    case 'sandbox':
      return 'sandbox';
    case 'pending':
    case 'processing':
    default:
      return 'processing';
  }
}

function buildApiBaseUrl(): string {
  return (process.env.MARZPAY_API_BASE_URL || 'https://wallet.wearemarz.com/api/v1').replace(/\/+$/, '');
}

function buildAuthorizationHeader(): string {
  const encodedCredentials =
    process.env.MARZPAY_BASIC_AUTH_TOKEN?.trim() || process.env.MARZPAY_AUTH_TOKEN?.trim();

  if (encodedCredentials) {
    return `Basic ${encodedCredentials}`;
  }

  const apiKey = process.env.MARZPAY_API_KEY?.trim();
  const apiSecret = process.env.MARZPAY_API_SECRET?.trim();

  if (!apiKey || !apiSecret) {
    throw new Error(
      'MarzPay is not configured. Set MARZPAY_BASIC_AUTH_TOKEN or provide MARZPAY_API_KEY and MARZPAY_API_SECRET.'
    );
  }

  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
}

function buildDescription(input: MarzPayCheckoutInput): string {
  const descriptor = input.eventId?.trim() ? `African Girl Rise event donation (${input.eventId.trim()})` : 'African Girl Rise donation';
  const donor = input.name?.trim() || input.email?.trim() || null;

  return donor ? `${descriptor} - ${donor}`.slice(0, 255) : descriptor;
}

function getResponseErrorMessage(source: unknown): string | null {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const candidates = ['message', 'error', 'detail'] as const;
  for (const key of candidates) {
    const value = (source as Record<string, unknown>)[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  const data = (source as Record<string, unknown>).data;
  if (data && typeof data === 'object') {
    for (const key of candidates) {
      const value = (data as Record<string, unknown>)[key];
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }
  }

  const errors = (source as MarzPayApiResult).errors;
  if (errors && typeof errors === 'object') {
    const firstEntry = Object.values(errors)[0];
    if (Array.isArray(firstEntry) && firstEntry.length > 0 && typeof firstEntry[0] === 'string') {
      return firstEntry[0];
    }

    if (typeof firstEntry === 'string' && firstEntry.trim()) {
      return firstEntry;
    }
  }

  return null;
}

async function marzPayRequest(path: string, init: RequestInit = {}) {
  const response = await fetch(`${buildApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: buildAuthorizationHeader(),
      ...(init.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getResponseErrorMessage(data) || 'MarzPay rejected the request.');
  }

  return data as MarzPayApiResult;
}

function buildCardBody(input: MarzPayCheckoutInput, reference: string): string {
  return JSON.stringify({
    amount: input.amount,
    callback_url: input.callbackUrl,
    country: 'UG',
    description: buildDescription(input),
    method: 'card',
    reference,
  });
}

function parseInitiateResult(input: MarzPayCheckoutInput, source: unknown, reference: string): DonationCheckoutResult {
  const responseReference = extractString(source, ['data', 'transaction', 'reference']) || reference;
  const amount = extractNumber(source, ['data', 'transaction', 'amount', 'raw']) ?? input.amount;
  const message = extractString(source, ['message']) || 'Donation initiated successfully.';
  const redirectUrl = extractRedirectUrl(source);
  const transactionId =
    extractString(source, ['data', 'transaction', 'id']) ||
    extractString(source, ['data', 'collection', 'id']) ||
    extractString(source, ['transaction', 'id']) ||
    null;
  const status = normalizeStatus(
    extractString(source, ['data', 'transaction', 'status']) ||
      extractString(source, ['data', 'collection', 'status']) ||
      extractString(source, ['transaction', 'status']) ||
      extractString(source, ['status'])
  );

  if (!redirectUrl) {
    throw new Error('MarzPay did not return a card checkout URL.');
  }

  return {
    amount,
    currency: 'UGX',
    message,
    method: 'card',
    provider: 'marzpay',
    redirectUrl,
    reference: responseReference,
    status,
    transactionId: transactionId || undefined,
  };
}

export async function initializeMarzPayCheckout(input: MarzPayCheckoutInput): Promise<DonationCheckoutResult> {
  const reference = crypto.randomUUID();

  const data = await marzPayRequest('/collect-money', {
    body: buildCardBody(input, reference),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  return parseInitiateResult(input, data, reference);
}

export async function getMarzPayCollectionStatus(transactionId: string): Promise<MarzPayCollectionStatus> {
  const normalizedId = transactionId.trim();
  if (!normalizedId) {
    throw new Error('Transaction ID is required.');
  }

  const data = await marzPayRequest(`/collect-money/${encodeURIComponent(normalizedId)}`, {
    method: 'GET',
  });

  const reference =
    extractString(data, ['data', 'transaction', 'reference']) || extractString(data, ['transaction', 'reference']);
  if (!reference) {
    throw new Error('MarzPay did not return a donation reference.');
  }

  return {
    amount:
      extractNumber(data, ['data', 'collection', 'amount', 'raw']) ||
      extractNumber(data, ['collection', 'amount', 'raw']) ||
      0,
    currency: 'UGX',
    description:
      extractString(data, ['data', 'collection', 'description']) ||
      extractString(data, ['transaction', 'description']) ||
      null,
    phoneNumber:
      extractString(data, ['data', 'collection', 'phone_number']) ||
      extractString(data, ['collection', 'phone_number']) ||
      extractString(data, ['transaction', 'phone_number']) ||
      null,
    provider: 'marzpay',
    providerName:
      extractString(data, ['data', 'collection', 'provider']) ||
      extractString(data, ['collection', 'provider']) ||
      extractString(data, ['transaction', 'provider']) ||
      null,
    reference,
    status: normalizeStatus(
      extractString(data, ['data', 'transaction', 'status']) ||
        extractString(data, ['transaction', 'status']) ||
        extractString(data, ['status'])
    ),
    transactionId: normalizedId,
  };
}
