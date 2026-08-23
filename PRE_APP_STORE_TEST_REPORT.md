# Raffle — Pre-App Store Test Report

Date: 2026-08-18

## Completed product slices

- Supabase authentication and automatic profile creation
- Automatic owner/admin activation for the verified project-owner email
- Live promotion feed
- Free entry with duplicate protection and 100-participant server cap
- Promoter item submission and admin review
- Supabase Storage bucket and owner-scoped upload policy for promotion images
- In-app official rules text/version display
- Content reporting and admin moderation queue
- Auditable promotion closing and winner drawing with stored draw seed
- Winner state in My Entries
- Push-token registration path (activation requires EAS project credentials during App Store setup)
- Promotion-service order records separated from free entry
- Platform payment routing model: Apple IAP / Google Play Billing / web checkout

## Verification performed

- TypeScript/TSX parser check: 25 source files parsed with 0 syntax errors.
- Live Supabase active-feed query returned all demo promotions with rules.
- Owner auto-activation tested inside a rollback transaction.
- Winner-draw function tested inside a rollback transaction.
- Full rollback E2E simulation passed:
  - owner admin: true
  - submission status: published
  - promotion status after draw: ended
  - entries: 1
  - draw records: 1
  - reports: 1
  - service orders: 1
- Supabase Security Advisor: 0 findings after final migrations.

## Device/store-gated checks for Step 8

The following require the real Apple/EAS developer environment and therefore are intentionally reserved for Step 8:

- Install dependencies with `npx expo install` / `npm install`
- Create an EAS development build and run on the physical iPhone
- Configure APNs/EAS credentials and verify a real push notification
- Create App Store Connect IAP product identifiers and add native IAP implementation/receipt validation credentials
- Configure App Store Connect Agreements, Tax, and Banking payout destination
- Replace draft legal rules with counsel-approved production rules and final geographic eligibility
- TestFlight purchase sandbox and final App Review flow

