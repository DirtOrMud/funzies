// src/firebase.js
// ─────────────────────────────────────────────────────────────
// Phase 3: Replace this file with your real Firebase config.
//
// Steps:
//  1. Go to https://console.firebase.google.com
//  2. Create a project → Add a web app
//  3. Copy your firebaseConfig object and paste it below
//  4. Enable "Realtime Database" in the Firebase console
//  5. Set database rules to allow read/write while testing:
//     { "rules": { ".read": true, ".write": true } }
//
// Once wired up, import { joinRoom, leaveRoom, syncRoom }
// from this file inside App.jsx
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, push, onValue, remove, onDisconnect, query, limitToLast } from 'firebase/database'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const db  = getDatabase(app)

// ── Utils ──────────────────────────────────────────────────────

export function makeUserId() {
  return Math.random().toString(36).slice(2, 9)
}

function statsKey(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '_')
}

// ── Room ───────────────────────────────────────────────────────

export async function joinRoom(roomCode, userId, avatar) {
  const userRef = ref(db, `rooms/${roomCode}/users/${userId}`)
  await set(userRef, {
    ...avatar,
    timer: { seconds: 25 * 60, running: false, onBreak: false, updatedAt: Date.now() },
    joinedAt: Date.now(),
  })
  onDisconnect(userRef).remove()
}

export async function leaveRoom(roomCode, userId) {
  await remove(ref(db, `rooms/${roomCode}/users/${userId}`))
}

export function syncUsers(roomCode, onUsers) {
  const usersRef = ref(db, `rooms/${roomCode}/users`)
  return onValue(usersRef, snapshot => {
    const data = snapshot.val() || {}
    onUsers(Object.entries(data).map(([id, val]) => ({ id, ...val })))
  })
}

export async function syncMyTimerToRoom(roomCode, userId, timerState) {
  await set(ref(db, `rooms/${roomCode}/users/${userId}/timer`), {
    ...timerState,
    updatedAt: Date.now(),
  })
}

export async function kickUser(roomCode, userId) {
  await remove(ref(db, `rooms/${roomCode}/users/${userId}`))
}

export async function sendMessage(roomCode, name, text) {
  if (!text.trim()) return
  console.log('sending:', roomCode, name, text)  // ← add this
  await push(ref(db, `rooms/${roomCode}/messages`), {
    name, text: text.trim(), sentAt: Date.now(),
  })
}

export function syncMessages(roomCode, onMessages) {
  const q = query(ref(db, `rooms/${roomCode}/messages`), limitToLast(20))
  return onValue(q, snapshot => {
    const data = snapshot.val() || {}
    onMessages(Object.entries(data).map(([id, val]) => ({ id, ...val })))
  })
}
// ── User stats (cross-device, name-based) ─────────────────────

export async function loadStats(name) {
  if (!name) return null
  const snapshot = await get(ref(db, `users/${statsKey(name)}/stats`))
  return snapshot.exists()
    ? snapshot.val()
    : { totalSecs: 0, sessions: 0, streak: 0, lastDate: null }
}

export async function saveStats(name, stats) {
  if (!name) return
  await set(ref(db, `users/${statsKey(name)}/stats`), stats)
}

export { db }