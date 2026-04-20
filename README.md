# StudyNook

A cozy café-style study overlay app. Study together with friends in real time.

---

## Project structure

```
studynook/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              ← React entry point
    ├── App.jsx               ← Root component, wires everything together
    ├── index.css             ← Global styles & CSS variables
    ├── firebase.js           ← Firebase config & helpers (fill in Phase 3)
    ├── hooks/
    │   ├── useTimer.js       ← All timer logic (start/pause/reset/break)
    │   └── useRoom.js        ← Firebase room sync (Phase 3 drop-in)
    └── components/
        ├── CafeScene.jsx     ← The illustrated café table + avatars
        ├── TimerPanel.jsx    ← Timer display, progress bar, controls
        ├── AvatarEditor.jsx  ← Pick name, emoji, color
        ├── TimerSettings.jsx ← Presets + custom focus/break lengths
        └── ParticipantsBar.jsx ← Room code, invite link, online chips
```

---

## Phase 2 — Run locally

### Prerequisites
- Node.js 18+ → https://nodejs.org

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → Opens at http://localhost:5173

# 3. Build for production
npm run build
```

---

## Phase 3 — Add Firebase (real multiplayer)

### 1. Create a Firebase project
1. Go to https://console.firebase.google.com
2. Click "Add project" → follow the steps (free Spark plan)
3. In your project: Build → Realtime Database → Create database
4. Choose "Start in test mode" (you can add proper rules later)
5. In Project Settings → Your apps → Add web app → copy the config

### 2. Paste your config
Open `src/firebase.js` and replace the `firebaseConfig` object with your values.

### 3. Install Firebase SDK
```bash
npm install firebase
```

### 4. Wire up the hook in App.jsx
Replace the `DEMO_USERS` array with the `useRoom` hook:

```jsx
// In App.jsx, replace:
import { useRoom } from './hooks/useRoom'

// Replace DEMO_USERS usage with:
const { users, myId } = useRoom('BREW-42', myAvatar)
```

That's it — avatars will sync in real time across all connected browsers.

### Room URL routing (optional but nice)
To let users join by URL (`yourapp.com?room=BREW-42`), read the room code from the URL:

```js
const roomCode = new URLSearchParams(window.location.search).get('room') || 'BREW-42'
```

---

## Phase 4 — Deploy to Vercel (free)

1. Push to GitHub:
```bash
git init && git add . && git commit -m "init studynook"
# Create repo at github.com, then:
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. Go to https://vercel.com → Import your GitHub repo
3. Vercel auto-detects Vite — just click Deploy
4. Add your Firebase config as Environment Variables in Vercel:
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_DATABASE_URL`, etc.
   - Update `firebase.js` to use `import.meta.env.VITE_FIREBASE_*`

Your app is live at `yourproject.vercel.app` — share the link!

---

## Phase 5 — Desktop overlay with Tauri (optional)

```bash
# Install Rust first: https://rustup.rs
npm install --save-dev @tauri-apps/cli
npx tauri init
```

In `src-tauri/tauri.conf.json`, configure the overlay window:
```json
"windows": [{
  "width": 360,
  "height": 560,
  "alwaysOnTop": true,
  "decorations": false,
  "transparent": true,
  "resizable": true
}]
```

Build the native app:
```bash
npx tauri build
```

---

## Firebase security rules (before going public)

Replace the test-mode rules with these once your app is working:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        "users": {
          "$userId": {
            ".read": true,
            ".write": "auth == null || auth.uid == $userId"
          }
        },
        "timer": {
          ".read": true,
          ".write": true
        }
      }
    }
  }
}
```
