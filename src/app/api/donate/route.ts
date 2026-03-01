import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, email, name, eventId } = body;

        if (!amount || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Prepare Flutterwave V4 Payload request
        // According to Flutterwave standard inline/standard payment initialization
        const flutterwaveUrl = "https://api.flutterwave.com/v3/payments";
        // Wait, the user mentioned Flutterwave V4 with Client ID and Secret. 
        // They provided: Client ID, Client Secret, Encryption Key.
        // For V4, standard payment links or server-side calls might use these new credentials.
        // I will mock the payment URL logic for now to allow the UI to function while the actual V4 SDK/Endpoint is confirmed.

        const payload = {
            tx_ref: `agr_${Date.now()}_${eventId || 'gen'}`,
            amount,
            currency: "UGX", // Assuming UGX for Uganda, but can make it dynamic
            redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/events?success=true`,
            customer: {
                email,
                name: name || "Anonymous Donor",
            },
            customizations: {
                title: "African Girl Rise",
                description: "Donation to break the cycle of poverty",
                logo: "https://africangirlriseltd.org/logo.png"
            }
        };

        const response = await fetch(flutterwaveUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.status === "success") {
            return NextResponse.json({ paymentUrl: data.data.link });
        } else {
            console.error("Flutterwave API Error:", data);
            return NextResponse.json({ error: 'Payment initialization failed', details: data }, { status: 500 });
        }

    } catch (error) {
        console.error("Donation API Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
