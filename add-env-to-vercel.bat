@echo off
echo ====================================
echo   Adding Payment Keys to Vercel
echo ====================================
echo.

set /p FLW_SECRET=Enter FLUTTERWAVE_SECRET_KEY (UGX mobile money): 
set /p STRIPE_SECRET=Enter STRIPE_SECRET_KEY (international cards): 
set /p BASE_URL=Enter NEXT_PUBLIC_BASE_URL (e.g. https://www.africangirlriseltd.org): 

echo.
echo Adding FLUTTERWAVE_SECRET_KEY...
echo %FLW_SECRET% | vercel env add FLUTTERWAVE_SECRET_KEY production
echo %FLW_SECRET% | vercel env add FLUTTERWAVE_SECRET_KEY preview
echo %FLW_SECRET% | vercel env add FLUTTERWAVE_SECRET_KEY development
echo.

echo Adding STRIPE_SECRET_KEY...
echo %STRIPE_SECRET% | vercel env add STRIPE_SECRET_KEY production
echo %STRIPE_SECRET% | vercel env add STRIPE_SECRET_KEY preview
echo %STRIPE_SECRET% | vercel env add STRIPE_SECRET_KEY development
echo.

echo Adding NEXT_PUBLIC_BASE_URL...
echo %BASE_URL% | vercel env add NEXT_PUBLIC_BASE_URL production
echo %BASE_URL% | vercel env add NEXT_PUBLIC_BASE_URL preview
echo %BASE_URL% | vercel env add NEXT_PUBLIC_BASE_URL development
echo.

echo Adding ADMIN_AUTH_SECRET...
echo d2fd4e6f20a35cb8182905993e36faca84e857b5447b80e7d07e5b928d209b17 | vercel env add ADMIN_AUTH_SECRET production
echo d2fd4e6f20a35cb8182905993e36faca84e857b5447b80e7d07e5b928d209b17 | vercel env add ADMIN_AUTH_SECRET preview
echo d2fd4e6f20a35cb8182905993e36faca84e857b5447b80e7d07e5b928d209b17 | vercel env add ADMIN_AUTH_SECRET development
echo.

echo Adding other variables...
echo africangirlriseltd@gmail.com | vercel env add ADMIN_LOGIN_EMAIL production preview development
echo rise2026 | vercel env add ADMIN_LOGIN_PASSWORD production preview development
echo onboarding@resend.dev | vercel env add SENDER_EMAIL production preview development
echo africangirlriseltd@gmail.com | vercel env add CONTACT_EMAIL production preview development

echo.
echo ====================================
echo   Done! Triggering production deployment...
echo ====================================
vercel --prod

echo.
echo All environment variables added!
echo Your site will be live at: https://www.africangirlriseltd.org
pause
