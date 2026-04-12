import type { DonationCheckoutResult, DonationCurrency } from '@/lib/marzpay';

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

type FlutterwaveApiError = {
  code?: string;
  message?: string;
  type?: string;
  validation_errors?: Array<{
    field_name?: string;
    message?: string;
  }>;
};

type FlutterwaveApiResult = {
  data?: Record<string, unknown>;
  error?: FlutterwaveApiError;
  message?: string;
  status?: string;
};

type FlutterwaveCustomerSearchResult = FlutterwaveApiResult & {
  data?: Array<Record<string, unknown>>;
};

type FlutterwaveTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
};

type NormalizedUgandanPhoneNumber = {
  countryCode: '256';
  e164: string;
  localNumber: string;
  nationalNumber: string;
};

type FlutterwaveRequestOptions = {
  allowFailure?: boolean;
  includeIdempotencyKey?: boolean;
};

export type FlutterwaveChargeStatus = {
  amount: number;
  chargeId: string;
  currency: DonationCurrency;
  network: string | null;
  nextActionType: string | null;
  phoneNumber: string | null;
  processorResponseType: string | null;
  provider: 'flutterwave';
  redirectUrl: string | null;
  reference: string;
  status: string;
};

const FLUTTERWAVE_PRODUCTION_BASE_URL = 'https://f4bexperience.flutterwave.com';
const FLUTTERWAVE_SANDBOX_BASE_URL = 'https://developersandbox-api.flutterwave.com';
const FLUTTERWAVE_TOKEN_URL = 'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';
const TOKEN_REFRESH_BUFFER_MS = 60_000;

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;

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

function getConfiguredSecretKey(): string | null {
  return process.env.FLUTTERWAVE_SECRET_KEY?.trim() || null;
}

function getConfiguredClientId(): string | null {
  return process.env.FLUTTERWAVE_CLIENT_ID?.trim() || null;
}

function getConfiguredClientSecret(): string | null {
  return process.env.FLUTTERWAVE_CLIENT_SECRET?.trim() || null;
}

function hasV4Credentials(): boolean {
  return Boolean(getConfiguredClientId() && getConfiguredClientSecret());
}

function getFlutterwaveApiBaseUrl(): string {
  const configuredBaseUrl = process.env.FLUTTERWAVE_API_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, '');
  }

  const configuredEnvironment = process.env.FLUTTERWAVE_ENVIRONMENT?.trim().toLowerCase();
  if (configuredEnvironment === 'sandbox' || configuredEnvironment === 'test') {
    return FLUTTERWAVE_SANDBOX_BASE_URL;
  }

  if (configuredEnvironment === 'production' || configuredEnvironment === 'live') {
    return FLUTTERWAVE_PRODUCTION_BASE_URL;
  }

  if (/^(1|true|yes)$/i.test(process.env.FLUTTERWAVE_USE_SANDBOX?.trim() || '')) {
    return FLUTTERWAVE_SANDBOX_BASE_URL;
  }

  return FLUTTERWAVE_PRODUCTION_BASE_URL;
}

function createRequestKey(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`.slice(0, 42);
}

function buildDescription(input: FlutterwaveMobileMoneyInput): string {
  const descriptor = input.eventId?.trim() ? `African Girl Rise event donation (${input.eventId.trim()})` : 'African Girl Rise donation';
  const donor = input.name?.trim() || input.email.trim();

  return `${descriptor} - ${donor}`.slice(0, 255);
}

function splitName(name: string | undefined): { firstName: string; lastName: string } {
  const trimmed = name?.trim();
  if (!trimmed) {
    return { firstName: 'AGR', lastName: 'Supporter' };
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return { firstName: parts[0].slice(0, 60), lastName: 'Supporter' };
  }

  return {
    firstName: parts[0].slice(0, 60),
    lastName: parts.slice(1).join(' ').slice(0, 80),
  };
}

function normalizePhoneNumber(phoneNumber: string): NormalizedUgandanPhoneNumber {
  const compact = phoneNumber.replace(/[\s()-]/g, '');

  if (/^\+256\d{9}$/.test(compact)) {
    const nationalNumber = compact.slice(4);
    return {
      countryCode: '256',
      e164: compact,
      localNumber: `0${nationalNumber}`,
      nationalNumber,
    };
  }

  if (/^256\d{9}$/.test(compact)) {
    const nationalNumber = compact.slice(3);
    return {
      countryCode: '256',
      e164: `+${compact}`,
      localNumber: `0${nationalNumber}`,
      nationalNumber,
    };
  }

  if (/^0\d{9}$/.test(compact)) {
    const nationalNumber = compact.slice(1);
    return {
      countryCode: '256',
      e164: `+256${nationalNumber}`,
      localNumber: compact,
      nationalNumber,
    };
  }

  throw new Error('Enter a valid Ugandan phone number using +256 or 0XXXXXXXXX format.');
}

function normalizeNetwork(network: string | undefined): FlutterwaveMobileMoneyNetwork {
  const value = network?.trim().toLowerCase();

  if (!value) {
    throw new Error('Select the mobile money network for this phone number.');
  }

  if (value === 'mtn') {
    return 'MTN';
  }

  if (value === 'airtel') {
    return 'Airtel';
  }

  throw new Error('Select either MTN or Airtel for Flutterwave mobile money.');
}

function createReference(eventId?: string): string {
  const suffix = eventId?.trim()?.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 12) || 'general';
  return `agrfw-${suffix}-${Date.now().toString(36)}`.slice(0, 42);
}

function getFlutterwaveErrorMessage(source: unknown): string | null {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const record = source as Record<string, unknown>;
  const message = record.message;
  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  const error = record.error;
  if (error && typeof error === 'object') {
    const nestedMessage = (error as Record<string, unknown>).message;
    if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
      return nestedMessage.trim();
    }

    const validationErrors = (error as FlutterwaveApiError).validation_errors;
    if (Array.isArray(validationErrors)) {
      const firstError = validationErrors.find((item) => typeof item?.message === 'string' && item.message.trim());
      if (firstError?.message) {
        return firstError.message.trim();
      }
    }
  }

  return null;
}

function normalizeFlutterwaveChargeState(status: string | null): string {
  switch (status?.trim().toLowerCase()) {
    case 'succeeded':
      return 'completed';
    case 'failed':
      return 'failed';
    case 'voided':
      return 'cancelled';
    case 'pending':
    default:
      return 'processing';
  }
}

function parseFlutterwaveChargeStatus(source: unknown): FlutterwaveChargeStatus {
  const chargeId = extractString(source, ['data', 'id']);
  const reference = extractString(source, ['data', 'reference']);

  if (!chargeId || !reference) {
    throw new Error('Flutterwave did not return the expected charge details.');
  }

  return {
    amount: extractNumber(source, ['data', 'amount']) ?? 0,
    chargeId,
    currency: (extractString(source, ['data', 'currency']) || 'UGX') as DonationCurrency,
    network: extractString(source, ['data', 'payment_method_details', 'mobile_money', 'network']),
    nextActionType: extractString(source, ['data', 'next_action', 'type']),
    phoneNumber: extractString(source, ['data', 'payment_method_details', 'mobile_money', 'phone_number']),
    processorResponseType: extractString(source, ['data', 'processor_response', 'type']),
    provider: 'flutterwave',
    redirectUrl:
      extractString(source, ['data', 'next_action', 'redirect_url', 'url']) ||
      extractString(source, ['data', 'next_action', 'redirect_url']) ||
      extractString(source, ['data', 'redirect_url']),
    reference,
    status: normalizeFlutterwaveChargeState(extractString(source, ['data', 'status'])),
  };
}

function buildFlutterwaveStatusUrl(baseRedirectUrl: string, charge: FlutterwaveChargeStatus): string {
  const url = new URL(baseRedirectUrl);
  url.searchParams.set('provider', 'flutterwave');
  url.searchParams.set('status', charge.status);
  url.searchParams.set('reference', charge.reference);
  url.searchParams.set('chargeId', charge.chargeId);

  if (charge.redirectUrl) {
    url.searchParams.set('authorizationUrl', charge.redirectUrl);
  }

  return url.toString();
}

function buildChargeFailureMessage(charge: FlutterwaveChargeStatus): string {
  if (charge.status === 'cancelled') {
    return 'Flutterwave cancelled the mobile money payment before it could be completed.';
  }

  return 'Flutterwave could not start the mobile money payment. Confirm the phone number and selected network, then try again.';
}

async function getFlutterwaveAccessToken(): Promise<string> {
  const clientId = getConfiguredClientId();
  const clientSecret = getConfiguredClientSecret();

  if (!clientId || !clientSecret) {
    throw new Error('Flutterwave is not configured. Set FLUTTERWAVE_SECRET_KEY or FLUTTERWAVE_CLIENT_ID and FLUTTERWAVE_CLIENT_SECRET.');
  }

  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt - TOKEN_REFRESH_BUFFER_MS) {
    return cachedAccessToken;
  }

  const response = await fetch(FLUTTERWAVE_TOKEN_URL, {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });

  const data = (await response.json().catch(() => null)) as FlutterwaveTokenResponse | null;
  if (!response.ok || !data?.access_token) {
    throw new Error('Flutterwave access token request failed. Check the configured v4 credentials.');
  }

  cachedAccessToken = data.access_token;
  cachedAccessTokenExpiresAt = Date.now() + (data.expires_in || 600) * 1000;

  return cachedAccessToken;
}

async function flutterwaveV4Request<T extends FlutterwaveApiResult = FlutterwaveApiResult>(
  path: string,
  init: RequestInit,
  options: FlutterwaveRequestOptions = {}
): Promise<{ data: T | null; response: Response }> {
  const accessToken = await getFlutterwaveAccessToken();
  const response = await fetch(`${getFlutterwaveApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Trace-Id': createRequestKey('trace'),
      ...(options.includeIdempotencyKey === false ? {} : { 'X-Idempotency-Key': createRequestKey('idempotency') }),
      ...(init.headers || {}),
    },
  });

  const data = (await response.json().catch(() => null)) as T | null;

  if (!options.allowFailure && (!response.ok || data?.status === 'failed')) {
    throw new Error(getFlutterwaveErrorMessage(data) || 'Flutterwave rejected the request.');
  }

  return { data, response };
}

async function searchFlutterwaveCustomerByEmail(email: string): Promise<string | null> {
  const { data } = await flutterwaveV4Request<FlutterwaveCustomerSearchResult>(
    '/customers/search?page=1&size=10',
    {
      body: JSON.stringify({ email }),
      method: 'POST',
    },
    {
      includeIdempotencyKey: false,
    }
  );

  const matches = Array.isArray(data?.data) ? data.data : [];
  const exactMatch = matches.find(
    (customer) => extractString(customer, ['email'])?.toLowerCase() === email.trim().toLowerCase()
  );

  return extractString(exactMatch || matches[0], ['id']);
}

async function getOrCreateFlutterwaveCustomerId(input: FlutterwaveMobileMoneyInput): Promise<string> {
  const phone = normalizePhoneNumber(input.phoneNumber);
  const donorName = splitName(input.name);
  const { data, response } = await flutterwaveV4Request(
    '/customers',
    {
      body: JSON.stringify({
        email: input.email.trim(),
        name: {
          first: donorName.firstName,
          last: donorName.lastName,
        },
        phone: {
          country_code: phone.countryCode,
          number: phone.localNumber,
        },
      }),
      method: 'POST',
    },
    {
      allowFailure: true,
    }
  );

  const customerId = extractString(data, ['data', 'id']);
  if (response.ok && data?.status !== 'failed' && customerId) {
    return customerId;
  }

  const message = getFlutterwaveErrorMessage(data) || 'Flutterwave could not create the donor profile.';
  if (/customer already exists/i.test(message)) {
    const existingCustomerId = await searchFlutterwaveCustomerByEmail(input.email.trim());
    if (existingCustomerId) {
      return existingCustomerId;
    }
  }

  throw new Error(message);
}

async function createFlutterwavePaymentMethodId(input: FlutterwaveMobileMoneyInput): Promise<string> {
  const phone = normalizePhoneNumber(input.phoneNumber);
  const network = normalizeNetwork(input.network);
  const { data } = await flutterwaveV4Request(
    '/payment-methods',
    {
      body: JSON.stringify({
        type: 'mobile_money',
        mobile_money: {
          country_code: phone.countryCode,
          network,
          phone_number: phone.localNumber,
        },
      }),
      method: 'POST',
    }
  );

  const paymentMethodId = extractString(data, ['data', 'id']);
  if (!paymentMethodId) {
    throw new Error('Flutterwave did not return a mobile money payment method.');
  }

  return paymentMethodId;
}

async function initializeFlutterwaveV4MobileMoneyCheckout(
  input: FlutterwaveMobileMoneyInput
): Promise<DonationCheckoutResult> {
  const reference = createReference(input.eventId);
  const customerId = await getOrCreateFlutterwaveCustomerId(input);
  const paymentMethodId = await createFlutterwavePaymentMethodId(input);
  const { data } = await flutterwaveV4Request(
    '/charges',
    {
      body: JSON.stringify({
        amount: input.amount,
        currency: input.currency,
        customer_id: customerId,
        payment_method_id: paymentMethodId,
        reference,
      }),
      method: 'POST',
    }
  );

  const charge = parseFlutterwaveChargeStatus(data);
  if (charge.status === 'failed' || charge.status === 'cancelled') {
    throw new Error(buildChargeFailureMessage(charge));
  }

  const statusUrl = buildFlutterwaveStatusUrl(input.redirectUrl, charge);
  const message =
    charge.status === 'completed'
      ? 'Flutterwave confirmed the donation.'
      : charge.redirectUrl
        ? 'Continue to Flutterwave to authorize the mobile money payment.'
        : 'Check your phone and approve the Flutterwave mobile money prompt.';

  return {
    amount: input.amount,
    authorizationUrl: charge.redirectUrl || undefined,
    currency: input.currency,
    message,
    method: 'mobile_money',
    provider: 'flutterwave',
    redirectUrl: charge.redirectUrl || statusUrl,
    reference: charge.reference,
    status: charge.status,
    transactionId: charge.chargeId,
  };
}

async function initializeFlutterwaveV3MobileMoneyCheckout(
  input: FlutterwaveMobileMoneyInput
): Promise<DonationCheckoutResult> {
  const secretKey = getConfiguredSecretKey();
  if (!secretKey) {
    throw new Error('Flutterwave is not configured. Set FLUTTERWAVE_SECRET_KEY or FLUTTERWAVE_CLIENT_ID and FLUTTERWAVE_CLIENT_SECRET.');
  }

  const reference = createReference(input.eventId);
  const phone = normalizePhoneNumber(input.phoneNumber);
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency,
      customer: {
        email: input.email,
        name: input.name?.trim() || 'African Girl Rise Supporter',
        phonenumber: phone.e164,
      },
      customizations: {
        description: buildDescription(input),
        title: 'African Girl Rise',
      },
      meta: {
        eventId: input.eventId || null,
        network: input.network || null,
        source: 'african-girl-rise',
      },
      payment_options: 'mobilemoneyuganda',
      redirect_url: input.redirectUrl,
      tx_ref: reference,
    }),
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const data = (await response.json().catch(() => null)) as FlutterwaveApiResult | null;
  const redirectUrl = extractString(data, ['data', 'link']);
  const txRef = extractString(data, ['data', 'tx_ref']) || reference;

  if (!response.ok || data?.status !== 'success' || !redirectUrl) {
    throw new Error(getFlutterwaveErrorMessage(data) || 'Flutterwave rejected the mobile money checkout request.');
  }

  return {
    amount: input.amount,
    currency: input.currency,
    message: data.message || 'Redirecting to Flutterwave for mobile money payment.',
    method: 'mobile_money',
    provider: 'flutterwave',
    redirectUrl,
    reference: txRef,
    status: 'processing',
  };
}

export async function initializeFlutterwaveMobileMoneyCheckout(
  input: FlutterwaveMobileMoneyInput
): Promise<DonationCheckoutResult> {
  if (hasV4Credentials()) {
    return initializeFlutterwaveV4MobileMoneyCheckout(input);
  }

  return initializeFlutterwaveV3MobileMoneyCheckout(input);
}

export async function getFlutterwaveChargeStatus(chargeId: string): Promise<FlutterwaveChargeStatus> {
  const normalizedChargeId = chargeId.trim();
  if (!normalizedChargeId) {
    throw new Error('Charge ID is required.');
  }

  if (!hasV4Credentials()) {
    throw new Error('Flutterwave v4 status checks require FLUTTERWAVE_CLIENT_ID and FLUTTERWAVE_CLIENT_SECRET.');
  }

  const { data } = await flutterwaveV4Request(`/charges/${encodeURIComponent(normalizedChargeId)}`, {
    method: 'GET',
  }, {
    includeIdempotencyKey: false,
  });

  return parseFlutterwaveChargeStatus(data);
}