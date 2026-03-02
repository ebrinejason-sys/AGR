# Adding Environment Variables to Vercel

## Option 1: Using Vercel Dashboard (RECOMMENDED)

1. **Go to your Vercel project dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your "african-girl-rise" project

2. **Navigate to Settings:**
   - Click "Settings" tab at the top
   - Click "Environment Variables" in the left sidebar

3. **Add each variable one at a time:**

### Flutterwave Keys
```
Name: NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
Value: FLWPUBK-7be789b35694bd742506ed040929dad6-X
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Name: FLUTTERWAVE_SECRET_KEY
Value: FLWSECK-c12ace65ee685cd82c5a08061b888fc6-19caf686925vt-X
Environments: ☑ Production ☑ Preview ☑ Development
```

### Admin Authentication
```
Name: ADMIN_AUTH_SECRET
Value: d2fd4e6f20a35cb8182905993e36faca84e857b5447b80e7d07e5b928d209b17
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Name: ADMIN_LOGIN_EMAIL
Value: africangirlriseltd@gmail.com
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Name: ADMIN_LOGIN_PASSWORD
Value: rise2026
Environments: ☑ Production ☑ Preview ☑ Development
```

### Email Configuration (Resend)
```
Name: RESEND_API_KEY
Value: [Get this from https://resend.com/api-keys]
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Name: SENDER_EMAIL
Value: onboarding@resend.dev
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Name: CONTACT_EMAIL
Value: africangirlriseltd@gmail.com
Environments: ☑ Production ☑ Preview ☑ Development
```

### Supabase Configuration
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [Get from https://supabase.com/dashboard - Settings → API]
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [From Supabase dashboard - anon/public key]
Environments: ☑ Production ☑ Preview ☑ Development
```

```
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
# Flutterwave Public Key
vercel env add NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
# When prompted, enter: FLWPUBK-7be789b35694bd742506ed040929dad6-X
# Select: Production, Preview, Development (space to select, enter to confirm)

# Flutterwave Secret Key
vercel env add FLUTTERWAVE_SECRET_KEY
# Enter: FLWSECK-c12ace65ee685cd82c5a08061b888fc6-19caf686925vt-X

# Admin Auth Secret
vercel env add ADMIN_AUTH_SECRET
# Enter: d2fd4e6f20a35cb8182905993e36faca84e857b5447b80e7d07e5b928d209b17

# Admin Login Email
vercel env add ADMIN_LOGIN_EMAIL
# Enter: africangirlriseltd@gmail.com

# Admin Login Password
vercel env add ADMIN_LOGIN_PASSWORD
# Enter: rise2026

# Email Config
vercel env add SENDER_EMAIL
# Enter: onboarding@resend.dev

vercel env add CONTACT_EMAIL
# Enter: africangirlriseltd@gmail.com
```

After adding all variables, deploy:
```powershell
vercel --prod
```

---

## Missing Keys You Need to Get:

1. **RESEND_API_KEY**: https://resend.com/api-keys
2. **Supabase keys**: https://supabase.com/dashboard → Your Project → Settings → API
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

---

## Quick Test After Deployment:

1. **Test Donations:**
   - Visit https://www.africangirlriseltd.org/events
   - Try UGX donation (should ask for phone number)
   - Try USD donation (should skip phone number)

2. **Test Admin Login:**
   - Visit https://www.africangirlriseltd.org/admin/login
   - Should send OTP via email

3. **Check Vercel Logs:**
   - If issues, check: https://vercel.com/dashboard → Deployments → Latest → Functions
