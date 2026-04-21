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
import { getDatabase, ref, set, onValue, remove, onDisconnect } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export function makeUserId() {
  return Math.random().toString(36).slice(2, 9)
}

export async function joinRoom(roomCode, userId, avatar) {
  const userRef = ref(db, `rooms/${roomCode}/users/${userId}`)
  await set(userRef, {
    ...avatar,
    timer: {
      seconds: 25 * 60,
      running: false,
      onBreak: false,
      updatedAt: Date.now(),
    },
    joinedAt: Date.now(),
  })
  onDisconnect(userRef).remove()
}

export async function syncMyTimerToRoom(roomCode, userId, timerState) {
  const userRef = ref(db, `rooms/${roomCode}/users/${userId}/timer`)
  await set(userRef, {
    seconds: timerState.seconds,
    running: timerState.running,
    onBreak: timerState.onBreak,
    updatedAt: Date.now(),
  })
}

export async function leaveRoom(roomCode, userId) {
  const userRef = ref(db, `rooms/${roomCode}/users/${userId}`)
  await remove(userRef)
}

export function syncUsers(roomCode, onUsers) {
  const usersRef = ref(db, `rooms/${roomCode}/users`)
  return onValue(usersRef, snapshot => {
    const data = snapshot.val() || {}
    const users = Object.entries(data).map(([id, val]) => ({ id, ...val }))
    onUsers(users)
  })
}

export { db }