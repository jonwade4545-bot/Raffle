# Raffle

Expo / React Native prototype connected to the live Supabase backend.

## Current pre-App Store build

This build includes authentication, live promotions, free entries, promoter submissions, admin review, item image upload, in-app rules, moderation/reporting, auditable winner selection, winner status, notification registration, and the promotion-service order/payment abstraction.

### Run locally

1. Install Node.js.
2. In this folder run `npm install`.
3. For Expo-compatible native package versions, if npm reports a version mismatch run:
   `npx expo install expo-image-picker expo-notifications expo-constants`
4. Run `npx expo start`.

The included `.env` contains only the Supabase project URL and publishable client key. Never add a Supabase service-role key to the app.

## Payment design

Entries are free and no purchase is required. Promotion-service purchases are stored separately from entries. iOS production purchases are intended to use Apple In-App Purchase; Android uses Play Billing; web can later use an appropriate web processor. Store product activation and payout banking are completed during the App Store / store-account setup stage.

## Legal note

The current official-rules text is explicitly marked as a draft for product testing. It must be replaced with jurisdiction-specific, counsel-approved production rules before public launch.

See `PRE_APP_STORE_TEST_REPORT.md` for the verification performed and the checks intentionally reserved for Step 8.
