# Adding Environment Variables to Vercel

## Option 1: Using Vercel Dashboard (RECOMMENDED)

1. **Go to your Vercel project dashboard:**
   - Visit: <https://vercel.com/dashboard>
   - Click on your "african-girl-rise" project

2. **Navigate to Settings:**
   - Click "Settings" tab at the top
   - Click "Environment Variables" in the left sidebar

3. **Add each variable one at a time:**

### Payments (Flutterwave + Stripe)

```text
Name: FLUTTERWAVE_SECRET_KEY
Value: FLWSECK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxx-X
Environments: ☑ Production ☑ Preview ☑ Development
```

```text
Name: STRIPE_SECRET_KEY
Value: your_stripe_secret_key_here
Environments: ☑ Production ☑ Preview ☑ Development
```

```text
Name: NEXT_PUBLIC_BASE_URL
Value: https://www.africangirlriseltd.org
Environments: ☑ Production ☑ Preview ☑ Development
```

### Admin Authentication

```text
Name: ADMIN_AUTH_SECRET
Value: d2fd4e6f20a35cb8182905993e36faca84e857b5447b80e7d07e5b928d209b17
Environments: ☑ Production ☑ Preview ☑ Development
```

```text
Name: ADMIN_LOGIN_EMAIL
Value: africangirlriseltd@gmail.com
Environments: ☑ Production ☑ Preview ☑ Development
```

### Email Configuration (Resend)

```text
Name: RESEND_API_KEY
Value: [Get this from https://resend.com/api-keys]
Environments: ☑ Production ☑ Preview ☑ Development
```

```text
Name: RESEND_FROM_EMAIL
Value: African Girl Rise <onboarding@resend.dev>
Environments: ☑ Production ☑ Preview ☑ Development
```

### Supabase Configuration

```text
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [Get from https://supabase.com/dashboard - Settings → API]
Environments: ☑ Production ☑ Preview ☑ Development
```

```text
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [From Supabase dashboard - anon/public key]
Environments: ☑ Production ☑ Preview ☑ Development
```

```text
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [From Supabase dashboard - service_role key (secret)]
Environments: ☑ Production ☑ Preview ☑ Development
```

4. **Trigger a new deployment:**
   - After adding all variables, Vercel will automatically redeploy
   - Or manually trigger: `vercel --prod` from terminal

---

## Option 2: Using Vercel CLI (Interactive)

Run these commands one by one. The CLI will prompt you to enter the value:

```powershell
# Flutterwave Secret (UGX Mobile Money)
vercel env add FLUTTERWAVE_SECRET_KEY
# Enter: FLWSECK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxx-X

# Stripe Secret (International Cards)
vercel env add STRIPE_SECRET_KEY
# Enter: your_stripe_secret_key_here

# Site URL used for payment success/cancel redirects
vercel env add NEXT_PUBLIC_BASE_URL
# Enter: https://www.africangirlriseltd.org

# Admin Auth Secret
vercel env add ADMIN_AUTH_SECRET
# Enter: d2fd4e6f20a35cb8182905993e36faca84e857b5447b80e7d07e5b928d209b17

# Admin Login Email
vercel env add ADMIN_LOGIN_EMAIL
# Enter: africangirlriseltd@gmail.com

# Email Config
vercel env add RESEND_FROM_EMAIL
# Enter: African Girl Rise <onboarding@resend.dev>
```

After adding all variables, deploy:

```powershell
vercel --prod
```

---

## Missing Keys You Need to Get

1. **RESEND_API_KEY**: <https://resend.com/api-keys>
2. **Supabase keys**: <https://supabase.com/dashboard> → Your Project → Settings → API
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
3. **Stripe key**: <https://dashboard.stripe.com/apikeys>

---

## Quick Test After Deployment

1. **Test Donations:**
   - Visit: <https://www.africangirlriseltd.org/events>
   - Try UGX donation (should ask for phone number)
   - Try USD donation (should skip phone number)

2. **Test Admin Login:**
   - Visit: <https://www.africangirlriseltd.org/admin/login>
   - Should send OTP via email

3. **Check Vercel Logs:**
   - If issues, check: <https://vercel.com/dashboard> → Deployments → Latest → Functions
