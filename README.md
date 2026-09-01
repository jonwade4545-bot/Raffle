
# Raffle Web Starter

This is a lightweight, mobile-friendly web version of Raffle connected to the existing Supabase backend.

## Included
- Responsive homepage
- Supabase connection using the project's publishable key
- Login
- Signup
- Logout
- Live promotion feed
- Create-promotion draft form
- Mobile bottom navigation
- No Expo or app-store build required

## Run locally
Because this uses JavaScript modules, serve the folder with any simple web server.

Examples:
- VS Code Live Server
- `python3 -m http.server 8080`
- Netlify / Vercel / Cloudflare Pages / GitHub Pages

Then open the provided local or hosted URL in Safari or Chrome.

## Important
Only the Supabase publishable key is used in browser code. Never place a Supabase secret/service-role key in this website.

## Next recommended build steps
1. Promotion detail page
2. Enter-promotion flow
3. Profile/account screen
4. Promoter submission screen
5. Admin moderation screen
6. Stripe web checkout for promotion services
7. Real domain + production hosting
