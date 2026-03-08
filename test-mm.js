const testMobileMoneyV4 = async () => {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', 'abacfd0c-134b-411f-979c-4a84ab858e2e');
        params.append('client_secret', 'l6wUd2td10o6QQvSWv6X4yi3XIw8UtVL');

        console.log('Fetching token...');
        const tokenRes = await fetch('https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
        const tokenData = await tokenRes.json();
        const token = tokenData.access_token;
        console.log('Got token');

        const payload = {
            tx_ref: `test_${Date.now()}`,
            amount: 1000,
            currency: "UGX",
            customerInfo: {
                email: "test@example.com",
                firstName: "Test",
                lastName: "Donor",
                phoneNumber: "256703727965"
            },
            payment_method: {
                type: "mobile_money",
                mobile_money: {
                    network: "MTN"
                }
            }
        };

        const url = 'https://f4bexperience-api.flutterwave.com/orchestration/direct-charges';

        console.log(`Testing ${url}`);
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        try {
            console.log(JSON.stringify(JSON.parse(text), null, 2));
        } catch {
            console.log(text.substring(0, 500));
        }
    } catch (err) {
        console.error(err);
    }
};
testMobileMoneyV4();
