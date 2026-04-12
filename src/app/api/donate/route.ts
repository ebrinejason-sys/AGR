import { NextResponse } from 'next/server';
import { rateLimit, getIP } from '@/lib/rate-limit';
import { initializeFlutterwaveMobileMoneyCheckout } from '@/lib/flutterwave';
import {
  initializeMarzPayCheckout,
  type DonationCurrency,
  type DonationMethod,
} from '@/lib/marzpay';

const VALID_CURRENCIES: DonationCurrency[] = ['UGX'];
const VALID_METHODS: DonationMethod[] = ['mobile_money', 'card'];
const MIN_AMOUNT = 500;
const MAX_AMOUNT = 10_000_000;

function resolveBaseUrl(req: Request): string {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, '');
  }

  const originHeader = req.headers.get('origin')?.trim();
  if (originHeader) {
    return originHeader.replace(/\/+$/, '');
  }

  return new URL(req.url).origin.replace(/\/+$/, '');
}

function isValidEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  try {
    const ip = getIP(req);
    const { isLimited, response } = rateLimit(ip, 5, 60 * 60 * 1000);
    if (isLimited) return response;

    const body = await req.json();
    const {
      amount,
      email,
      name,
      eventId,
      currency = 'UGX',
      method = 'mobile_money',
      phoneNumber,
      mobileMoneyNetwork,
    } = body as {
      amount: number | string;
      email?: string;
      name?: string;
      eventId?: string;
      currency?: DonationCurrency;
      method?: DonationMethod;
      phoneNumber?: string;
      mobileMoneyNetwork?: string;
    };

    if (email && String(email).length > 255) {
      return NextResponse.json({ error: 'Email too long.' }, { status: 400 });
    }

    if (name && String(name).length > 255) {
      return NextResponse.json({ error: 'Name too long.' }, { status: 400 });
    }

    if (phoneNumber && String(phoneNumber).length > 32) {
      return NextResponse.json({ error: 'Phone number too long.' }, { status: 400 });
    }

    if (mobileMoneyNetwork && String(mobileMoneyNetwork).length > 32) {
      return NextResponse.json({ error: 'Mobile money network value is too long.' }, { status: 400 });
    }

    const parsedAmount = Number(amount);
    if (!VALID_CURRENCIES.includes(currency)) {
      return NextResponse.json({ error: 'Invalid currency. Donations are processed in UGX.' }, { status: 400 });
    }

    if (!VALID_METHODS.includes(method)) {
      return NextResponse.json({ error: 'Invalid donation method. Use mobile_money or card.' }, { status: 400 });
    }

    if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount < MIN_AMOUNT || parsedAmount > MAX_AMOUNT) {
      return NextResponse.json(
        { error: `Donation amount must be between UGX ${MIN_AMOUNT.toLocaleString()} and UGX ${MAX_AMOUNT.toLocaleString()}.` },
        { status: 400 }
      );
    }

    const normalizedEmail = email?.trim();
    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    if (!isValidEmailAddress(normalizedEmail)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    if (method === 'mobile_money' && !phoneNumber?.trim()) {
      return NextResponse.json({ error: 'Phone number is required for mobile money donations.' }, { status: 400 });
    }

    if (method === 'mobile_money' && !mobileMoneyNetwork?.trim()) {
      return NextResponse.json({ error: 'Select the mobile money network for this donation.' }, { status: 400 });
    }

    const appBaseUrl = resolveBaseUrl(req);
    const normalizedName = name?.trim() || undefined;

    const checkout =
      method === 'mobile_money'
        ? await initializeFlutterwaveMobileMoneyCheckout({
            amount: parsedAmount,
            currency,
            email: normalizedEmail,
            eventId,
            name: normalizedName,
            network: mobileMoneyNetwork?.trim(),
            phoneNumber: phoneNumber?.trim() || '',
            redirectUrl: `${appBaseUrl}/pay?provider=flutterwave`,
          })
        : await initializeMarzPayCheckout({
            amount: parsedAmount,
            currency,
            email: normalizedEmail,
            name: normalizedName,
            eventId,
            callbackUrl: `${appBaseUrl}/api/marzpay/callback?provider=marzpay`,
          });

    return NextResponse.json(checkout);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = /not configured/i.test(message)
      ? 503
      : /required|valid|select|maximum|minimum|phone number|network/i.test(message)
        ? 400
        : 502;

    console.error('Donation API Error:', error);
    return NextResponse.json({ error: message }, { status });
  }
}
