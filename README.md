# GF Chat

Static calculator and Firebase-backed private chat with explicit, one-time location sharing.

## Architecture
- GitHub Pages serves the static frontend.
- Firebase Authentication uses email/password.
- Firebase Realtime Database stores room membership, messages, and each member's latest shared location.
- database.rules.json provides server-enforced room access rules.
- Firebase Emulator Suite is used for rules testing.

## Setup
1. In Firebase Console, confirm the existing project's exact Web app config and Realtime Database URL.
2. Enable Authentication > Sign-in method > Email/Password.
3. Add ahsanibnewalid.github.io to Authentication authorized domains.
4. Copy firebase-config.example.js to firebase-config.js and fill in the existing values. Never add service-account keys to frontend code.
5. Review database.rules.json and back up the current rules and data paths before publishing. Test with the emulator first.
6. Publish reviewed rules to the intended Firebase project. Do not blindly replace rules if this database is shared with another application.
7. Deploy the static site to GitHub Pages. Location requires HTTPS.

## Room usage
Sign in or create an account, create a room, then share the room ID and add the other participant by their Firebase Auth UID. The owner must add their UID. A room ID alone does not authorize access. Anyone with an account can create a room; production abuse prevention requires a trusted server-side rate limiter.

## Tests
Install a supported Node.js LTS version and run npm install, npm run test:calculator, and npm run test:rules. The rules test uses local Firebase emulators and must not use production data.

## Security limitations
- Firebase web config is public client configuration, not an admin secret.
- Security depends on the rules actually being published to the correct Firebase project.
- Location is requested only after a button press; Stop sharing removes the latest stored location, but recipients may already have copied it.
- Email verification is not enforced by database rules in this version.
- Firebase rules do not provide robust rate limiting.
- Test with real browsers and two separate accounts before treating the site as production-ready.
