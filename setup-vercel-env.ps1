# Vercel Environment Variables Setup Script
# Run this script to add all required environment variables to Vercel

Write-Host "Setting up Vercel environment variables..." -ForegroundColor Green
Write-Host ""

# Function to add environment variable
function Add-VercelEnv {
    param (
        [string]$Name,
        [string]$Description
    )
    
    Write-Host "Adding $Name..." -ForegroundColor Cyan
    Write-Host "Description: $Description" -ForegroundColor Gray
    Write-Host "Please enter the value for $Name (or press Enter to skip):" -ForegroundColor Yellow
    $value = Read-Host
    
    if ($value -ne "") {
        Write-Host "  Adding to production, preview, and development..." -ForegroundColor Gray
        vercel env add $Name production preview development --value $value
        Write-Host "  ✓ Added $Name" -ForegroundColor Green
    } else {
        Write-Host "  ⊘ Skipped $Name" -ForegroundColor Red
    }
    Write-Host ""
}

# Required Environment Variables
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  RESEND EMAIL SERVICE" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Add-VercelEnv "RESEND_API_KEY" "Resend API key for OTP and contact emails (starts with re_)"
Add-VercelEnv "SENDER_EMAIL" "Sender email address (default: onboarding@resend.dev)"
Add-VercelEnv "CONTACT_EMAIL" "Contact recipient email (africangirlriseltd@gmail.com)"

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  ADMIN AUTHENTICATION" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Add-VercelEnv "ADMIN_LOGIN_EMAIL" "Admin login email (africangirlriseltd@gmail.com)"
Add-VercelEnv "ADMIN_LOGIN_PASSWORD" "Admin login password (rise2026)"
Add-VercelEnv "ADMIN_AUTH_SECRET" "Random 256-bit secret for token signing (generate with: node -e 'console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))')"

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  SUPABASE DATABASE" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Add-VercelEnv "NEXT_PUBLIC_SUPABASE_URL" "Supabase project URL (https://xxx.supabase.co)"
Add-VercelEnv "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Supabase anonymous key (starts with eyJ)"
Add-VercelEnv "SUPABASE_SERVICE_ROLE_KEY" "Supabase service role key (starts with eyJ) - KEEP SECRET"

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  FLUTTERWAVE PAYMENTS" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Add-VercelEnv "NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY" "Flutterwave public key (starts with FLWPUBK-)"
Add-VercelEnv "FLUTTERWAVE_SECRET_KEY" "Flutterwave secret key (starts with FLWSECK-) - KEEP SECRET"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To verify environment variables, run:" -ForegroundColor Yellow
Write-Host "  vercel env ls" -ForegroundColor Cyan
Write-Host ""
Write-Host "To trigger a new deployment with these variables:" -ForegroundColor Yellow
Write-Host "  vercel --prod" -ForegroundColor Cyan
