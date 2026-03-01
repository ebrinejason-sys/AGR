import { NextResponse } from 'next/server';
import { resend, ADMIN_EMAIL, SENDER_EMAIL } from '@/lib/resend';

// Store OTPs temporarily in memory. (Note: For production at scale, use Redis or Database)
const otpStore = new Map<string, { otp: string, expires: number }>();

export async function POST(req: Request) {
    try {
        const { action, email, password, otp } = await resend.json?.() ?? await req.json();

        const TARGET_EMAIL = 'africangirlriseltd@gmail.com';
        const TARGET_PASSWORD = 'rise2026';

        if (action === 'request_otp') {
            if (email !== TARGET_EMAIL || password !== TARGET_PASSWORD) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            // Generate a 6-digit OTP
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            // Store it with a 10 minute expiration
            otpStore.set(email, {
                otp: generatedOtp,
                expires: Date.now() + 10 * 60 * 1000
            });

            // Send the OTP via Resend
            const { error } = await resend.emails.send({
                from: SENDER_EMAIL,
                to: TARGET_EMAIL,
                subject: 'Your Admin Login OTP - African Girl Rise',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #d81b60;">Admin Login Attempt</h2>
            <p>Someone is attempting to log into the African Girl Rise Admin Dashboard.</p>
            <p>Here is your One-Time Password (OTP):</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="letter-spacing: 5px; color: #4a148c; margin: 0;">${generatedOtp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `
            });

            if (error) {
                console.error("Resend Error:", error);
                return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'OTP sent successfully' });
        }

        if (action === 'verify_otp') {
            const storedData = otpStore.get(email);

            if (!storedData) {
                return NextResponse.json({ error: 'OTP expired or invalid' }, { status: 400 });
            }

            if (Date.now() > storedData.expires) {
                otpStore.delete(email);
                return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
            }

            if (storedData.otp !== otp) {
                return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
            }

            // Success! Clear the OTP.
            otpStore.delete(email);

            return NextResponse.json({ success: true, message: 'OTP verified' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (err) {
        console.error('Auth API Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
