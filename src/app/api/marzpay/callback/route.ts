import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null);
    const eventType = typeof payload?.event_type === 'string' ? payload.event_type : 'unknown';
    const reference = typeof payload?.transaction?.reference === 'string' ? payload.transaction.reference : 'unknown';
    const status = typeof payload?.transaction?.status === 'string' ? payload.transaction.status : 'unknown';

    console.info('MarzPay callback received', {
      eventType,
      reference,
      status,
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('MarzPay callback handling error:', error);
    return NextResponse.json({ received: false }, { status: 200 });
  }
}

export async function GET(req: Request) {
  const incomingUrl = new URL(req.url);
  const redirectUrl = new URL('/pay', incomingUrl.origin);

  incomingUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value);
  });

  if (!redirectUrl.searchParams.has('provider')) {
    redirectUrl.searchParams.set('provider', 'marzpay');
  }

  if (!redirectUrl.searchParams.has('status')) {
    redirectUrl.searchParams.set('status', 'processing');
  }

  return NextResponse.redirect(redirectUrl);
}
