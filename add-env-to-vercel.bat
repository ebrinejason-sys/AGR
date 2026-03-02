@echo off
echo ====================================
echo   Adding Flutterwave Keys to Vercel
echo ====================================
echo.

echo Adding NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY...
echo FLWPUBK-7be789b35694bd742506ed040929dad6-X | vercel env add NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY production
echo FLWPUBK-7be789b35694bd742506ed040929dad6-X | vercel env add NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY preview
echo FLWPUBK-7be789b35694bd742506ed040929dad6-X | vercel env add NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY development
echo.

echo Adding FLUTTERWAVE_SECRET_KEY...
echo FLWSECK-c12ace65ee685cd82c5a08061b888fc6-19caf686925vt-X | vercel env add FLUTTERWAVE_SECRET_KEY production
echo FLWSECK-c12ace65ee685cd82c5a08061b888fc6-19caf686925vt-X | vercel env add FLUTTERWAVE_SECRET_KEY preview
echo FLWSECK-c12ace65ee685cd82c5a08061b888fc6-19caf686925vt-X | vercel env add FLUTTERWAVE_SECRET_KEY development
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
