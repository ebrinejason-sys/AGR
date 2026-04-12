import { NextResponse } from 'next/server';
import { getFlutterwaveChargeStatus } from '@/lib/flutterwave';
import { rateLimit, getIP } from '@/lib/rate-limit';
import { getMarzPayCollectionStatus } from '@/lib/marzpay';

export async function GET(req: Request) {
  try {
    const ip = getIP(req);
    const { isLimited, response } = rateLimit(ip, 60, 5 * 60 * 1000);
    if (isLimited) return response;

    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider')?.trim().toLowerCase() || null;
    const chargeId = searchParams.get('chargeId')?.trim();
    const transactionId = searchParams.get('transactionId')?.trim();

    if (provider === 'flutterwave' || (!provider && chargeId)) {
      if (!chargeId) {
        return NextResponse.json({ error: 'Charge ID is required for Flutterwave status checks.' }, { status: 400 });
      }

      const status = await getFlutterwaveChargeStatus(chargeId);

      return NextResponse.json(status, {
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    if (provider === 'marzpay' || (!provider && transactionId)) {
      if (!transactionId) {
        return NextResponse.json({ error: 'Transaction ID is required for MarzPay status checks.' }, { status: 400 });
      }

      const status = await getMarzPayCollectionStatus(transactionId);

      return NextResponse.json(status, {
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    return NextResponse.json(
      { error: 'Provide provider=flutterwave with chargeId or provider=marzpay with transactionId.' },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = /required|valid|select/i.test(message) ? 400 : /not configured/i.test(message) ? 503 : 502;

    console.error('Donation status API Error:', error);
    return NextResponse.json({ error: message }, { status });
  }
}
