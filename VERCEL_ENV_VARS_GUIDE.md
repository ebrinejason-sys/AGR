# Vercel Environment Variables Guide

This guide contains all the essential environment variables required for the African Girl Rise project. You should copy these into your new Vercel project's dashboard settings.

## 1. Supabase (Database & Media)
Required for data storage and media management.

| Variable | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | `https://dupwvxngxgmbpnezhnum.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1cHd2eG5neGdtYnBuZXpobnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTQ2OTIsImV4cCI6MjA4Nzg5MDY5Mn0.iPQc_Nxw7g9DPTXfVCV9rikn2EDb4is6IYdToRW-88Q` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1cHd2eG5neGdtYnBuZXpobnVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMxNDY5MiwiZXhwIjoyMDg3ODkwNjkyfQ.u8NGsXqmbnDfGNH2i2ObpOLhyMwD-T2y9iNR7cfq3lQ` |
| `SUPABASE_MEDIA_BUCKET` | `media` |

## 2. Admin Authentication
Required for the Admin Dashboard login and OTP system.

| Variable | Value |
| :--- | :--- |
| `ADMIN_LOGIN_EMAIL` | `africangirlriseltd@gmail.com` |
| `ADMIN_LOGIN_PASSWORD` | `rise2026` |
| `ADMIN_AUTH_SECRET` | `5f59f0494c04f386f9a3f675fef92137e8c750555c4c271f625d4d381c5c2876` |

## 3. Email Service (Resend)
Required for sending contact form notifications and Admin OTPs.

| Variable | Value |
| :--- | :--- |
| `RESEND_API_KEY` | `re_Sq6vvpN8_CvWn84B4mRwkU7Q5Jc1Vs1Xw` |
| `RESEND_FROM_EMAIL` | `African Girl Rise <noreply@africangirlriseltd.org>` |
| `CONTACT_EMAIL` | `africangirlriseltd@gmail.com` |
| `SENDER_EMAIL` | `onboarding@resend.dev` |

## 4. Payments (Flutterwave & Marzpay)
Required for donations and processing payments.

| Variable | Value |
| :--- | :--- |
| `FLUTTERWAVE_CLIENT_ID` | `abacfd0c-134b-411f-979c-4a84ab858e2e` |
| `FLUTTERWAVE_CLIENT_SECRET` | `7fvSYgBPOayx18IM4t2rOV6K50Z0cVxe` |
| `FLUTTERWAVE_ENCRYPTION_KEY` | `O4uZkRgn9MjMqdvqtXopGTm+M2f/bZWoTQi4y4jyA70=` |
| `MARZPAY_BASIC_AUTH_TOKEN` | `bWFyel9nTEpTdExZRDRTNEdxeEw5OmlMbVFtZWVhd3IyNnFLNUhiZ2M4MjNjam5US09CRXda` |

## 5. Public URLs
Required for generating absolute links in emails and redirects.

| Variable | Value |
| :--- | :--- |
| `VITE_BASE_URL` | `https://www.africangirlriseltd.org` |
| `NEXT_PUBLIC_BASE_URL` | `https://www.africangirlriseltd.org` |

---

### How to apply these in the new Vercel project:
1. Go to your new project in the Vercel Dashboard.
2. Navigate to **Settings** -> **Environment Variables**.
3. Add each variable one by one.
4. Ensure the **Framework Preset** is set to **Vite** before deploying.
