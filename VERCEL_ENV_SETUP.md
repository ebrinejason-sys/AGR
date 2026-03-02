# Vercel Environment Variables - Quick Setup Guide

## Use these commands to add environment variables to Vercel:

### 1. RESEND EMAIL (for admin OTP and contact forms)
```powershell
vercel env add RESEND_API_KEY
# When prompted:
# - Enter your Resend API key (starts with re_)
# - Select: Production, Preview, Development (all three)
```

```powershell
vercel env add SENDER_EMAIL
# Enter: onboarding@resend.dev
# Select: Production, Preview, Development
```

```powershell
vercel env add CONTACT_EMAIL
# Enter: africangirlriseltd@gmail.com
# Select: Production, Preview, Development
```

### 2. ADMIN AUTHENTICATION
```powershell
vercel env add ADMIN_LOGIN_EMAIL
# Enter: africangirlriseltd@gmail.com
# Select: Production, Preview, Development
```

```powershell
vercel env add ADMIN_LOGIN_PASSWORD
# Enter: rise2026
# Select: Production, Preview, Development
```

```powershell
vercel env add ADMIN_AUTH_SECRET
# Generate a random secret first:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output and paste it
# Select: Production, Preview, Development
```

### 3. SUPABASE DATABASE
```powershell
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://your-project.supabase.co
# Select: Production, Preview, Development
```

```powershell
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter: your Supabase anon key (starts with eyJ)
# Select: Production, Preview, Development
```

```powershell
vercel env add SUPABASE_SERVICE_ROLE_KEY
# Enter: your Supabase service role key (starts with eyJ)
# Select: Production, Preview, Development
```

### 4. FLUTTERWAVE PAYMENTS
```powershell
vercel env add NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
# Enter: your Flutterwave public key (starts with FLWPUBK-)
# Select: Production, Preview, Development
```

```powershell
vercel env add FLUTTERWAVE_SECRET_KEY
# Enter: your Flutterwave secret key (starts with FLWSECK-)
# Select: Production, Preview, Development
```

## After adding all variables:

### View all environment variables:
```powershell
vercel env ls
```

### Trigger new production deployment:
```powershell
vercel --prod
```

## Quick Environment Selection in Vercel CLI:
- When prompted "Which Environments", use arrow keys and spacebar to select
- Press Enter to confirm
- Typically select all three: **Production, Preview, Development**

## Notes:
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for client-side)
- Secret keys (SERVICE_ROLE_KEY, SECRET_KEY, AUTH_SECRET) should NEVER be public
- You can update existing variables with: `vercel env rm VARIABLE_NAME` then add again
