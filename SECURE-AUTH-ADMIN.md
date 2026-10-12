# GF Chat Authentication Admin

This adds a Render-hosted API and a GitHub Pages dashboard for Firebase Authentication provider credentials. Merging code does not deploy the backend; deploy it separately and configure secrets in Render.

## Security model
- admin.html is a static dashboard; admin-config.js contains only the public backend URL.
- server.js verifies Firebase ID tokens and checks the UID against ADMIN_UIDS.
- OAuth credentials are AES-256-GCM encrypted before storage in Firebase Realtime Database at systemConfig/authProviders.
- Secret values are never returned by the status API. Encryption key and service-account JSON exist only in Render environment variables.
- Provider apply uses Google's Identity Platform admin API and requires service-account permissions.
- Email/password enablement and email-verification enforcement require Firebase/client setup too. The saved verification preference does not by itself enforce access.

## Deploy backend to Render
1. Create a Render Web Service from this repository or use render.yaml.
2. Configure:
   - FIREBASE_PROJECT_ID=secretchatwithgf
   - FIREBASE_DATABASE_URL=https://secretchatwithgf-default-rtdb.asia-southeast1.firebasedatabase.app
   - FIREBASE_SERVICE_ACCOUNT_JSON: full JSON contents of a dedicated service-account key. Never commit it. Enable Identity Toolkit API and grant least-privilege permission to update Firebase Authentication provider configs and access Realtime Database.
   - SECRETS_ENCRYPTION_KEY: 32 random bytes as 64 hexadecimal characters. Generate with openssl rand -hex 32. Back it up securely; rotating it without re-encrypting stored records makes them unreadable.
   - ADMIN_UIDS: comma-separated Firebase Auth UIDs allowed to administer settings. Create an account, copy its UID, and add it here. Authorization is by UID, not email.
   - ALLOWED_ORIGINS=https://ahsanibnewalid.github.io
3. Build command: npm install --omit=dev. Start command: npm start.
4. Visit /health on the Render URL; it should return JSON with ok=true.

## Publish admin dashboard
1. Edit the existing admin-config.js and replace the placeholder with the real Render URL. It contains only a public URL.
2. Commit the updated admin-config.js to the GitHub Pages branch.
3. Open https://ahsanibnewalid.github.io/gf-chat/admin.html and sign in with the Firebase account whose UID is in ADMIN_UIDS.
4. Enter credentials, Save, then Apply to Firebase. Set each provider's developer-console settings and exact callback URLs first.

## Provider notes
- Firebase supports Google, Facebook, GitHub, Apple and Microsoft, but each provider needs its own developer-console configuration.
- Never guess OAuth callback URLs; use the callback shown in Firebase/provider console.
- Apple requires Apple Developer configuration and a key/Service ID. Microsoft may require tenant setup.
- Enable Email/Password in Firebase Console at least once. The password switch records a preference and does not remotely toggle that provider.
- Verified email is mandatory in the frontend and Realtime Database rules. The admin dashboard intentionally does not allow disabling this safety requirement.
- Add ahsanibnewalid.github.io to Firebase Authentication authorized domains.
- Rotate any secret that is accidentally exposed.

## Important
The existing chat rules should be reviewed before using the same database for admin configuration. Firebase Admin SDK bypasses Realtime Database rules, so protect its service account and ADMIN_UIDS list carefully.