const testV4Endpoints = async () => {
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
        if (!tokenData.access_token) {
            console.error("Failed to get token", tokenData);
            return;
        }
        const token = tokenData.access_token;
        console.log('Got token');

        const payload = {
            tx_ref: `test_${Date.now()}`,
            amount: 1000,
            currency: "UGX",
            redirect_url: "https://africangirlriseltd.org/events?donation=success",
            customer: {
                email: "test@example.com",
                name: "Test Donor",
                phonenumber: "256703727965"
            },
            customizations: {
                title: 'African Girl Rise',
            }
        };

        const endpoints = [
            'https://f4bexperience-api.flutterwave.com/charges',
            'https://f4bexperience.flutterwave.com/charges',
            'https://api.flutterwave.com/v4/charges',
            'https://api.flutterwave.com/v4/payments',
            'https://developer-f4bexperience.api.flutterwave.com/charges'
        ];

        for (const url of endpoints) {
            console.log(`\nTesting ${url}`);
            try {
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
                    console.log(JSON.parse(text));
                } catch {
                    console.log(text.substring(0, 200));
                }
            } catch (e) {
                console.log(`Error: ${e.message}`);
            }
        }

    } catch (err) {
        console.error(err);
    }
};
testV4Endpoints();
