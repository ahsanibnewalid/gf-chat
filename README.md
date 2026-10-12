# GF Chat

Responsive calculator and Firebase-backed private chat with explicit, one-time location sharing. Includes a separate system-admin dashboard and a Render API for securely configuring authentication providers.

## Architecture
- GitHub Pages serves the static frontend and admin.html.
- Firebase Authentication supports email/password, Google, Facebook, GitHub, Apple and Microsoft sign-in when each provider is configured.
- A Render-hosted Node.js API verifies Firebase ID tokens and authorizes admins by Firebase UID allowlist.
- OAuth secrets are encrypted with AES-256-GCM before being stored in Firebase Realtime Database.
- The backend can apply provider settings through Google Identity Platform's Admin API.
- Firebase Realtime Database stores room membership, messages, and each member's latest shared location.
- database.rules.json provides chat access rules; Firebase Emulator Suite is used for rules testing.

## Authentication provider admin setup
See SECURE-AUTH-ADMIN.md for full deployment instructions.

1. Deploy the backend with render.yaml or create a Render Web Service.
2. Configure Render environment variables: FIREBASE_SERVICE_ACCOUNT_JSON, SECRETS_ENCRYPTION_KEY, ADMIN_UIDS, FIREBASE_PROJECT_ID, FIREBASE_DATABASE_URL, and ALLOWED_ORIGINS.
3. Copy admin-config.example.js to admin-config.js, set the public Render service URL, and commit it to the GitHub Pages branch.
4. Open https://ahsanibnewalid.github.io/gf-chat/admin.html and sign in with a Firebase account whose UID is in ADMIN_UIDS.
5. Enter each provider's credentials, Save, then Apply to Firebase. Complete the provider's own developer-console setup and callback URL configuration first.
6. Enable Email/Password in Firebase Authentication if it is not already enabled. The dashboard can apply the email/password enable/disable setting through Identity Toolkit API.

Do not commit service-account JSON, OAuth client secrets, Apple private keys, or SECRETS_ENCRYPTION_KEY. firebase-config.js contains public web-app configuration, not an admin credential. Keep it distinct from backend secrets.

## Firebase and GitHub Pages setup
1. Confirm the Firebase Web app config and Realtime Database URL in Firebase Console.
2. Add ahsanibnewalid.github.io to Firebase Authentication authorized domains.
3. Review and back up existing database rules and data before publishing database.rules.json; do not replace rules blindly if the database is shared with another app.
4. Publish the reviewed rules to the intended Firebase project.
5. Test the site in a real browser using two separate accounts. Location requires HTTPS.

## Room usage
Sign in or create an account, verify the email for email/password accounts, create a room, then share the room ID and add the other participant by Firebase Auth UID. A room ID alone does not authorize access. Production abuse prevention requires a trusted server-side rate limiter.

## Tests
Install Node.js 20 or newer. Run:
- npm install
- npm run test:calculator
- npm run test:rules
- node --check server.js

The rules test uses local Firebase emulators and must not use production data.

## Security notes
- Admin authorization is checked on the backend using the UID allowlist, not merely by hiding dashboard controls.
- Provider secrets are encrypted at rest and never returned by the status API. The encryption key must be backed up securely; changing it without re-encrypting records makes stored credentials unreadable.
- Email/password verification is enforced by the current frontend before chat access, but the admin verification-policy switch is only a stored policy preference in this version. It does not remotely alter Realtime Database rules.
- Social provider sign-in requires the provider to be enabled in Firebase and configured in the provider's developer console. OAuth callback URLs must match exactly.
- Apple requires Apple Developer setup; Microsoft account types and tenant access are configured in Microsoft Entra.
- Security depends on the rules actually being published to the correct Firebase project.
- Location is requested only after a button press; recipients may already have copied a shared location.
- Firebase rules do not provide robust rate limiting. Test before treating the app as production-ready.
