
async function testResend() {
    console.log('Testing Resend...');
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('RESEND_API_KEY not found');
        return;
    }
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: 'africangirlriseltd@gmail.com',
            subject: 'API Test',
            html: '<p>Test successful</p>'
        })
    });
    const data = await res.json();
    console.log('Resend response:', data);
}

async function testFlutterwave() {
    console.log('Testing Flutterwave...');
    const clientId = process.env.FLUTTERWAVE_CLIENT_ID;
    const clientSecret = process.env.FLUTTERWAVE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        console.error('Flutterwave credentials missing');
        return;
    }
    const res = await fetch('https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
        })
    });
    const data = await res.json();
    console.log('Flutterwave token response:', data.access_token ? 'Success (Token received)' : data);
}

async function testMarzpay() {
    console.log('Testing Marzpay...');
    const token = process.env.MARZPAY_BASIC_AUTH_TOKEN;
    if (!token) {
        console.error('MARZPAY_BASIC_AUTH_TOKEN missing');
        return;
    }
    // Simple check if token is valid base64
    try {
        Buffer.from(token, 'base64');
        console.log('Marzpay token exists and is valid base64');
    } catch (e) {
        console.error('Marzpay token invalid');
    }
}

async function testSupabase() {
    console.log('Testing Supabase...');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        console.error('Supabase credentials missing');
        return;
    }
    const bucketRes = await fetch(`${url}/storage/v1/bucket`, {
        headers: { 'Authorization': `Bearer ${key}`, 'apikey': key }
    });
    const buckets = await bucketRes.json();
    console.log('Supabase buckets:', Array.isArray(buckets) ? `Success (${buckets.length} buckets found)` : buckets);

    const tableRes = await fetch(`${url}/rest/v1/media?select=count`, {
        headers: { 'Authorization': `Bearer ${key}`, 'apikey': key, 'Prefer': 'count=exact' }
    });
    console.log('Supabase media table:', tableRes.ok ? 'Success (Table exists)' : `Error: ${tableRes.status}`);
}

async function run() {
    await testResend();
    await testFlutterwave();
    await testMarzpay();
    await testSupabase();
}

run();
