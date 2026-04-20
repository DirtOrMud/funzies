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

// TODO: replace with your config from the Firebase console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig)
const db  = getDatabase(app)

// ── Helpers ────────────────────────────────────────────────────

/** Generate a short random user ID (replace with Firebase Auth uid if you add auth) */
export function makeUserId() {
  return Math.random().toString(36).slice(2, 9)
}

/**
 * Join a room: write this user's avatar to the room, and
 * automatically remove them if they disconnect.
 *
 * @param {string} roomCode  e.g. "BREW-42"
 * @param {string} userId    unique id for this session
 * @param {{ name, emoji, color }} avatar
 */
export async function joinRoom(roomCode, userId, avatar) {
  const userRef = ref(db, `rooms/${roomCode}/users/${userId}`)
  await set(userRef, { ...avatar, joinedAt: Date.now() })
  // Auto-remove when the browser tab closes
  onDisconnect(userRef).remove()
}

/**
 * Leave a room manually (e.g. user clicks "leave").
 */
export async function leaveRoom(roomCode, userId) {
  const userRef = ref(db, `rooms/${roomCode}/users/${userId}`)
  await remove(userRef)
}

/**
 * Subscribe to all users in a room.
 * Calls `onUsers` whenever someone joins or leaves.
 *
 * @param {string} roomCode
 * @param {(users: Array) => void} onUsers
 * @returns unsubscribe function
 */
export function syncUsers(roomCode, onUsers) {
  const usersRef = ref(db, `rooms/${roomCode}/users`)
  const unsub = onValue(usersRef, snapshot => {
    const data = snapshot.val() || {}
    const users = Object.entries(data).map(([id, val]) => ({ id, ...val }))
    onUsers(users)
  })
  return unsub
}

/**
 * Sync the shared timer state to the room.
 * Only the "host" (first person to start the timer) should write;
 * everyone else reads.
 *
 * @param {string} roomCode
 * @param {{ running, seconds, onBreak }} timerState
 */
export async function pushTimerState(roomCode, timerState) {
  const timerRef = ref(db, `rooms/${roomCode}/timer`)
  await set(timerRef, { ...timerState, updatedAt: Date.now() })
}

/**
 * Subscribe to shared timer state.
 *
 * @param {string} roomCode
 * @param {(state) => void} onTimer
 * @returns unsubscribe function
 */
export function syncTimer(roomCode, onTimer) {
  const timerRef = ref(db, `rooms/${roomCode}/timer`)
  return onValue(timerRef, snapshot => {
    if (snapshot.exists()) onTimer(snapshot.val())
  })
}

export { db }
