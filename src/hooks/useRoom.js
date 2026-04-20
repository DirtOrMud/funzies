// src/hooks/useRoom.js
// ─────────────────────────────────────────────────────────────
// Drop-in hook for Phase 3.
//
// Usage in App.jsx:
//
//   import { useRoom } from './hooks/useRoom'
//
//   const { users, joinedRoomCode } = useRoom(roomCode, myAvatar)
//
// Replace the DEMO_USERS array in App.jsx with `users` from this hook.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from 'react'
import { joinRoom, leaveRoom, syncUsers, makeUserId } from '../firebase'

const userId = makeUserId()   // stable for this browser session

export function useRoom(roomCode, avatar) {
  const [users, setUsers] = useState([])
  const unsubRef = useRef(null)

  useEffect(() => {
    if (!roomCode || !avatar) return

    // Join the room
    joinRoom(roomCode, userId, avatar)

    // Listen for changes
    unsubRef.current = syncUsers(roomCode, allUsers => {
      setUsers(allUsers)
    })

    // Clean up on unmount or room change
    return () => {
      unsubRef.current?.()
      leaveRoom(roomCode, userId)
    }
  }, [roomCode, avatar?.name, avatar?.emoji, avatar?.color])

  return { users, myId: userId }
}
